import type { StoryDeepDive } from "@/types/ramadan";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface Props {
  story: StoryDeepDive;
}

export function StoryDrawer({ story }: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rc-story-trigger">
          <span className="rc-story-trigger-icon">📜</span>
          {story.triggerLabel}
          <span className="rc-story-trigger-arrow">→</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="rc-story-drawer-content">
        <DrawerHeader className="rc-story-header">
          <DrawerTitle className="rc-story-title">{story.title}</DrawerTitle>
          {story.subtitle && (
            <DrawerDescription className="rc-story-subtitle">
              {story.subtitle}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="rc-story-body">
          {/* Narrative */}
          <div className="rc-story-narrative">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Relevant Verses */}
          {story.relevantVerses.length > 0 && (
            <div className="rc-story-verses-section">
              <div className="rc-story-section-label">Relevant Verses</div>
              {story.relevantVerses.map((verse, i) => (
                <div key={i} className="rc-story-verse-card">
                  <div className="rc-story-verse-arabic" dir="rtl">
                    {verse.arabic}
                  </div>
                  {verse.transliteration && (
                    <div className="rc-story-verse-transliteration">
                      {verse.transliteration}
                    </div>
                  )}
                  <div className="rc-story-verse-translation">
                    "{verse.translation}"
                  </div>
                  <div className="rc-story-verse-ref">{verse.reference}</div>
                </div>
              ))}
            </div>
          )}

          {/* Lessons Learned */}
          {story.lessonsLearned.length > 0 && (
            <div className="rc-story-lessons-section">
              <div className="rc-story-section-label">Lessons for Today</div>
              {story.lessonsLearned.map((lesson, i) => (
                <div key={i} className="rc-story-lesson">
                  <div className="rc-story-lesson-marker" />
                  <p>{lesson}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>

      <style>{storyDrawerStyles}</style>
    </Drawer>
  );
}

const storyDrawerStyles = `
  /* ── Story Trigger Button ── */
  .rc-story-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(26, 122, 90, 0.08), rgba(201, 168, 76, 0.06));
    border: 1px solid var(--rc-border-glow);
    border-radius: 12px;
    color: var(--rc-cream-soft);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .rc-story-trigger:hover {
    border-color: var(--rc-gold-dim);
    background: linear-gradient(135deg, rgba(26, 122, 90, 0.12), rgba(201, 168, 76, 0.1));
  }

  .rc-story-trigger-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .rc-story-trigger-arrow {
    margin-left: auto;
    color: var(--rc-gold);
    font-size: 1.1rem;
    transition: transform 0.2s ease;
  }

  .rc-story-trigger:hover .rc-story-trigger-arrow {
    transform: translateX(3px);
  }

  /* ── Drawer Content ── */
  .rc-story-drawer-content {
    background: var(--rc-bg-deep, #0a1a14) !important;
    border-color: var(--rc-border-glow) !important;
    max-height: 85vh !important;
  }

  .rc-story-header {
    padding: 20px 24px 0 !important;
    text-align: center !important;
  }

  .rc-story-title {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.5rem !important;
    color: var(--rc-gold) !important;
    font-weight: 500 !important;
  }

  .rc-story-subtitle {
    font-size: 0.92rem !important;
    color: var(--rc-text-muted) !important;
    font-style: italic !important;
    margin-top: 4px !important;
  }

  /* ── Drawer Body ── */
  .rc-story-body {
    padding: 20px 24px 32px;
    overflow-y: auto;
    max-height: calc(85vh - 100px);
    -webkit-overflow-scrolling: touch;
  }

  /* ── Narrative ── */
  .rc-story-narrative p {
    font-size: 1rem;
    color: var(--rc-text-secondary);
    line-height: 1.85;
    margin-bottom: 16px;
  }

  .rc-story-narrative p:last-child {
    margin-bottom: 0;
  }

  /* ── Verses Section ── */
  .rc-story-verses-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--rc-border);
  }

  .rc-story-section-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--rc-gold-dim);
    font-weight: 600;
    margin-bottom: 12px;
  }

  .rc-story-verse-card {
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.06), rgba(26, 122, 90, 0.04));
    border: 1px solid var(--rc-border-glow);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 12px;
    text-align: center;
  }

  .rc-story-verse-arabic {
    font-family: 'Amiri', serif;
    font-size: clamp(1.3rem, 4vw, 1.8rem);
    color: var(--rc-gold);
    line-height: 2;
    margin-bottom: 10px;
  }

  .rc-story-verse-transliteration {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.92rem;
    color: var(--rc-text-muted);
    margin-bottom: 8px;
    line-height: 1.6;
  }

  .rc-story-verse-translation {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--rc-cream-soft);
    margin-bottom: 6px;
    line-height: 1.7;
  }

  .rc-story-verse-ref {
    font-size: 0.8rem;
    color: var(--rc-text-muted);
    letter-spacing: 0.05em;
  }

  /* ── Lessons Section ── */
  .rc-story-lessons-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--rc-border);
  }

  .rc-story-lesson {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: rgba(26, 122, 90, 0.06);
    border-radius: 10px;
    border-left: 2px solid var(--rc-emerald);
  }

  .rc-story-lesson-marker {
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    background: var(--rc-emerald);
    border-radius: 50%;
    margin-top: 8px;
  }

  .rc-story-lesson p {
    font-size: 0.95rem;
    color: var(--rc-text-secondary);
    line-height: 1.7;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .rc-story-body {
      padding: 16px 16px 24px;
    }
    .rc-story-verse-card {
      padding: 16px;
    }
    .rc-story-trigger {
      padding: 14px 16px;
    }
  }
`;
