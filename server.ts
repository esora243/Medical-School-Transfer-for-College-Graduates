import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import cookieSession from 'cookie-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite Database
const isDev = process.env.NODE_ENV === 'development' || (!process.env.NODE_ENV && process.env.VITE_USER_NODE_ENV !== 'production');
const dbPath = isDev ? 'database.sqlite' : '/tmp/database.sqlite';
const db = new Database(dbPath);

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  '' // Redirect URI will be set dynamically
);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    university TEXT NOT NULL,
    year INTEGER NOT NULL,
    field TEXT NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    explanation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert some initial dummy data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO questions (university, year, field, question_text, answer_text, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  insert.run('大阪大学 医学部', 2024, '生命科学', 'アポトーシスとネクローシスの違いについて、分子メカニズムを含めて説明せよ。', 'アポトーシスはプログラムされた細胞死であり、カスパゼ活性化を伴う。ネクローシスは受動的な死で炎症を伴う。', 'ミトコンドリア経路やデスレセプター経路の関与を記述すること。');
  insert.run('北海道大学 医学部', 2023, '英語', 'Describe the ethical implications of genome editing in human embryos.', 'Genome editing (e.g., CRISPR-Cas9) raises concerns about "designer babies" and long-term genetic changes.', 'Ethical, social, and biological risks should be balanced.');
  insert.run('名古屋大学 医学部', 2024, '物理・化学', 'ヘンリーの法則の定義と、その生体内での応用例（潜水病など）について述べよ。', '一定温度で、一定量の溶媒に溶ける気体の質量は、その気体の分圧に比例する。', '高圧下で血液に溶けた窒素が急激な減圧で気泡化するのが潜水病である。');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieSession({
    name: 'session',
    keys: ['secret-key'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    sameSite: 'none'
  }));

  // Helper to get dynamic redirect URI
  const getRedirectUri = (req: express.Request) => {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'];
    return `${protocol}://${host}/auth/google/callback`;
  };

  // --- API Routes ---

  // Google Auth URL
  app.get('/api/auth/google/url', (req, res) => {
    const redirectUri = getRedirectUri(req);
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      redirect_uri: redirectUri,
      prompt: 'consent'
    });
    res.json({ url });
  });

  // Google Auth Callback
  app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const redirectUri = getRedirectUri(req);
    
    try {
      const { tokens } = await oauth2Client.getToken({
        code: code as string,
        redirect_uri: redirectUri
      });
      req.session!.tokens = tokens;
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>認証に成功しました。このウィンドウは自動的に閉じます。</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Check Auth Status
  app.get('/api/auth/google/status', (req, res) => {
    res.json({ connected: !!req.session?.tokens });
  });

  // Logout Google
  app.post('/api/auth/google/logout', (req, res) => {
    req.session = null;
    res.json({ success: true });
  });

  // List Drive Files
  app.get('/api/drive/files', async (req, res) => {
    if (!req.session?.tokens) return res.status(401).json({ error: 'Not connected' });

    const auth = new google.auth.OAuth2();
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel'",
        fields: 'files(id, name, modifiedTime)',
        pageSize: 20
      });
      res.json(response.data.files);
    } catch (error) {
      console.error('Drive List Error:', error);
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  // Import from Drive
  app.post('/api/drive/import/:fileId', async (req, res) => {
    if (!req.session?.tokens) return res.status(401).json({ error: 'Not connected' });

    const auth = new google.auth.OAuth2();
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      const response = await drive.files.get(
        { fileId: req.params.fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );

      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(Buffer.from(response.data as ArrayBuffer));
    } catch (error) {
      console.error('Drive Import Error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  // Get all questions
  app.get('/api/questions', (req, res) => {
    try {
      const questions = db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  // Add a new question (Admin only in a real app)
  app.post('/api/questions', (req, res) => {
    const { university, year, field, question_text, answer_text, explanation } = req.body;
    
    if (!university || !year || !field || !question_text || !answer_text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO questions (university, year, field, question_text, answer_text, explanation)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(university, year, field, question_text, answer_text, explanation);
      
      const newQuestion = db.prepare('SELECT * FROM questions WHERE id = ?').get(info.lastInsertRowid);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  // Bulk add questions
  app.post('/api/questions/bulk', (req, res) => {
    const questions = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Expected an array of questions' });
    }

    const insert = db.prepare(`
      INSERT INTO questions (university, year, field, question_text, answer_text, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((qs) => {
      for (const q of qs) {
        insert.run(
          q.university || '', 
          q.year || new Date().getFullYear(), 
          q.field || '', 
          q.question_text || '', 
          q.answer_text || '', 
          q.explanation || ''
        );
      }
    });

    try {
      insertMany(questions);
      res.json({ success: true, count: questions.length });
    } catch (error) {
      console.error('Bulk insert error:', error);
      res.status(500).json({ error: 'Failed to bulk insert questions' });
    }
  });

  // Delete a question
  app.delete('/api/questions/:id', (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
      const info = stmt.run(req.params.id);
      
      if (info.changes > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Question not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  // --- Vite Middleware ---
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
