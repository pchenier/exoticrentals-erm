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
    return NextResponse.json({
      success: true,
      commit: commitData.commit.sha,
      message: 'Data saved and deploying',
    });
  } catch (err) {
    console.error('Save data error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}