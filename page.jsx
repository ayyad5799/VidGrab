'use client';

import { useState, useCallback } from 'react';

// ─── Helpers ───────────────────────────────────────────────────────────────

function detectPlatform(url) {
  if (!url) return null;
  if (/youtu\.?be/.test(url)) return { name: 'YouTube', color: '#ff0000', emoji: '▶️' };
  if (/instagram/.test(url)) return { name: 'Instagram', color: '#e1306c', emoji: '📷' };
  if (/tiktok/.test(url)) return { name: 'TikTok', color: '#69c9d0', emoji: '🎵' };
  if (/twitter|x\.com/.test(url)) return { name: 'Twitter/X', color: '#1d9bf0', emoji: '🐦' };
  if (/facebook/.test(url)) return { name: 'Facebook', color: '#1877f2', emoji: '📘' };
  if (/reddit/.test(url)) return { name: 'Reddit', color: '#ff4500', emoji: '🤖' };
  return { name: 'Link', color: '#6b7f99', emoji: '🔗' };
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'video';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── Components ────────────────────────────────────────────────────────────

function PlatformTag({ name, color, emoji }) {
  return (
    <span className="platform-tag">
      <span className="platform-dot" style={{ background: color }} />
      {emoji} {name}
    </span>
  );
}

function ResultArea({ data, url }) {
  const platform = detectPlatform(url);

  if (data.status === 'redirect' || data.status === 'tunnel' || data.status === 'stream') {
    return (
      <div className="result">
        <div className="result-header">
          <span className="status-dot" />
          <span>جاهز للتحميل</span>
          {platform && (
            <span style={{ color: platform.color, marginRight: 'auto' }}>
              {platform.emoji} {platform.name}
            </span>
          )}
        </div>
        <button
          className="btn-trigger-download"
          onClick={() => triggerDownload(data.url, data.filename || 'video.mp4')}
        >
          ⬇️ تحميل الفيديو
        </button>
      </div>
    );
  }

  if (data.status === 'picker') {
    return (
      <div className="result">
        <div className="result-header">
          <span className="status-dot" />
          <span>اختار الملف اللي عاوز تحمله</span>
        </div>
        {data.audio && (
          <button
            className="btn-trigger-download"
            style={{ marginBottom: '0.75rem', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}
            onClick={() => triggerDownload(data.audio, 'audio.mp3')}
          >
            🎵 تحميل الصوت فقط
          </button>
        )}
        <div className="picker-grid">
          {data.picker?.map((item, i) => (
            <div
              key={i}
              className="picker-item"
              onClick={() => triggerDownload(item.url, `video_${i + 1}.mp4`)}
            >
              {item.thumb && (
                <img src={item.thumb} alt={`Item ${i + 1}`} loading="lazy" />
              )}
              <div className="picker-item-label">
                {item.type === 'video' ? '🎬' : '🖼️'} عنصر {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const platform = detectPlatform(url);

  const handleDownload = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 'error') {
        const msg = data.message || data.error?.code || 'حصل خطأ، تأكد من الرابط وحاول تاني';
        setError(friendlyError(msg));
      } else {
        setResult(data);
      }
    } catch {
      setError('مش قادر يوصل للسيرفر، جرب تاني.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleKey = (e) => {
    if (e.key === 'Enter') handleDownload();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">VidGrab</span>
        </div>

        <h1>
          حمّل أي فيديو<br />
          <span>في ثانية واحدة</span>
        </h1>
        <p className="subtitle">
          YouTube · Instagram · TikTok · Twitter/X وأكتر من كده
        </p>

        <div className="platforms">
          <PlatformTag name="YouTube" color="#ff0000" emoji="▶️" />
          <PlatformTag name="Instagram" color="#e1306c" emoji="📷" />
          <PlatformTag name="TikTok" color="#69c9d0" emoji="🎵" />
          <PlatformTag name="Twitter/X" color="#1d9bf0" emoji="🐦" />
          <PlatformTag name="Facebook" color="#1877f2" emoji="📘" />
          <PlatformTag name="Reddit" color="#ff4500" emoji="🤖" />
        </div>
      </header>

      {/* Card */}
      <main className="card">
        {/* Detected platform */}
        {platform && url.length > 10 && (
          <div className="detected-platform">
            <span>تم التعرف على:</span>
            <span
              className="detected-platform-badge"
              style={{
                background: platform.color + '22',
                color: platform.color,
                border: `1px solid ${platform.color}44`,
              }}
            >
              {platform.emoji} {platform.name}
            </span>
          </div>
        )}

        {/* Input */}
        <div className="input-group">
          <div className="url-input-wrap">
            <span className="url-icon">🔗</span>
            <input
              className="url-input"
              type="url"
              placeholder="الصق رابط الفيديو هنا..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setResult(null);
                setError('');
              }}
              onKeyDown={handleKey}
              dir="ltr"
            />
          </div>
          <button
            className="btn-download"
            onClick={handleDownload}
            disabled={loading || !url.trim()}
          >
            {loading ? '⏳' : '⚡'} تحميل
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <span>بيجيب الفيديو...</span>
          </div>
        )}

        {error && !loading && (
          <div className="error-box">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {result && !loading && (
          <ResultArea data={result} url={url} />
        )}
      </main>

      {/* Tips */}
      <section className="tips">
        <div className="tip">
          <div className="tip-icon">🔒</div>
          <div className="tip-title">خصوصية تامة</div>
          <div className="tip-desc">مش بنحفظ أي روابط أو بيانات. كل حاجة بتتعمل في الوقت الفعلي.</div>
        </div>
        <div className="tip">
          <div className="tip-icon">⚡</div>
          <div className="tip-title">سرعة فائقة</div>
          <div className="tip-desc">تحميل مباشر من السيرفر بدون تأخير أو إعلانات مزعجة.</div>
        </div>
        <div className="tip">
          <div className="tip-icon">📱</div>
          <div className="tip-title">شغال على كل حاجة</div>
          <div className="tip-desc">موبايل، تابلت، لاب توب — بيشتغل على أي جهاز وأي متصفح.</div>
        </div>
      </section>

      <footer className="footer">
        <p>VidGrab · مبني بـ Next.js · Powered by cobalt</p>
        <p style={{ marginTop: '0.35rem', opacity: 0.6 }}>
          الاستخدام للأغراض الشخصية فقط · احترم حقوق الملكية الفكرية
        </p>
      </footer>
    </div>
  );
}

// ─── Error messages in Arabic ───────────────────────────────────────────────

function friendlyError(code) {
  const map = {
    'error.api.unreachable': 'مش قادر يوصل لـ cobalt API. جرب تاني.',
    'error.api.fetch.short': 'الرابط قصير جداً أو مش صح.',
    'error.api.fetch.empty': 'الرابط فاضي. حط الرابط الصح.',
    'error.api.link.unsupported': 'الموقع دا مش مدعوم لسه.',
    'error.api.content.too_long': 'الفيديو طويل جداً.',
    'error.api.fetch.private': 'المحتوى دا خاص (private).',
    'error.api.rate_exceeded': 'وصلت لحد الاستخدام. استنى شوية وجرب تاني.',
  };
  return map[code] || `حصل خطأ: ${code}`;
}
