/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const REPO_OWNER = 'pchenier';
const REPO_NAME = 'exoticrentals-erm';
const FILE_PATH = 'lib/data.ts';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1666777';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, content } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    // Get current file SHA (needed for update)
    const fileRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!fileRes.ok) {
      return NextResponse.json({ error: 'Failed to get file from GitHub' }, { status: 500 });
    }

    const fileData = await fileRes.json();
    const sha = fileData.sha;

    // Commit updated content
    const commitRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Admin dashboard: update vehicle data',
          content: Buffer.from(content).toString('base64'),
          sha,
          branch: 'main',
        }),
      }
    );

    if (!commitRes.ok) {
      const errText = await commitRes.text();
      return NextResponse.json({ error: 'GitHub commit failed', details: errText }, { status: 500 });
    }

    const commitData = await commitRes.json();

    // Auto-alias: wait for the new Vercel deploy triggered by the git commit, then alias domains
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
    const PROJECT_ID = 'prj_pWFn4Uq0BtnMo8YAvKiQAzZcf4vl';
    const DOMAINS = ['exoticrentalsmontreal.com', 'www.exoticrentalsmontreal.com'];
    let aliasStatus = 'skipped (no VERCEL_TOKEN)';

    if (VERCEL_TOKEN) {
      try {
        // Poll for the newest deployment to become READY (max 120s)
        let readyDeployment: string | null = null;
        const startTime = Date.now();

        while (Date.now() - startTime < 50000) {
          await new Promise((r) => setTimeout(r, 5000));

          const deploysRes = await fetch(
            `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1&target=production`,
            {
              headers: {
                Authorization: `Bearer ${VERCEL_TOKEN}`,
              },
            }
          );

          if (deploysRes.ok) {
            const deploysData = await deploysRes.json();
            const latest = deploysData.deployments?.[0];
            if (latest && latest.state === 'READY' && latest.meta?.githubCommitSha === commitData.commit.sha) {
              readyDeployment = latest.uid;
              break;
            }
          }
        }

        if (readyDeployment) {
          let aliased = 0;
          for (const domain of DOMAINS) {
            const aliasRes = await fetch(`https://api.vercel.com/v2/deployments/${readyDeployment}/aliases`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${VERCEL_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ domain }),
            });
            if (aliasRes.ok) aliased++;
          }
          aliasStatus = `aliased (${aliased} domains)`;
        } else {
          aliasStatus = 'deploy not ready within 50s';
        }
      } catch (aliasErr) {
        aliasStatus = `alias error: ${(aliasErr as Error).message}`;
      }
    }

    return NextResponse.json({
      success: true,
      commit: commitData.commit.sha,
      message: 'Data saved and deploying',
      aliasStatus,
    });
  } catch (err) {
    console.error('Save data error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}