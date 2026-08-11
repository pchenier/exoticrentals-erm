/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const REPO_OWNER = 'pchenier';
const REPO_NAME = 'exoticrentals-erm';
const FILE_PATH = 'lib/vehicles.json';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1666777';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, vehicles, faqs, reviews } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!vehicles || !Array.isArray(vehicles)) {
      return NextResponse.json({ error: 'Missing vehicles array' }, { status: 400 });
    }

    const jsonContent = JSON.stringify({ vehicles, faqs: faqs || [], reviews: reviews || [] }, null, 2);

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

    let sha: string | undefined;
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    }

    // Commit updated JSON
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
          message: 'Admin: update vehicle data (instant)',
          content: Buffer.from(jsonContent).toString('base64'),
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

    return NextResponse.json({
      success: true,
      commit: commitData.commit.sha,
      message: 'Saved! Changes are live instantly (no rebuild needed).',
    });
  } catch (err) {
    console.error('Save data error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}