import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, MessageSquare, Globe, Mail } from 'lucide-react';
import Container from './Container';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-glass-border bg-surface-0">
      <Container clean className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                🌾
              </div>
              <span className="text-lg font-bold font-display text-text-primary">{t('app.name')}</span>
            </div>
            <p className="text-text-secondary text-sm max-w-md mb-4">
              {t('app.description')}
            </p>
            <div className="flex gap-3">
              {[ExternalLink, MessageSquare, Globe, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-surface-1 border border-glass-border text-text-muted hover:text-primary-400 hover:border-primary-400/30 transition-all" aria-label="Social link">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 font-body">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: t('footer.about'), href: '#' },
                { label: t('footer.privacy'), href: '#' },
                { label: t('footer.terms'), href: '#' },
                { label: t('footer.contact'), href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-text-muted hover:text-primary-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 font-body">Resources</h4>
            <ul className="space-y-2">
              {['ICAR Guidelines', 'KVK Directory', 'PM-KISAN', 'eNAM Portal'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-muted hover:text-primary-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-glass-border text-center">
          <p className="text-xs text-text-muted">{t('footer.copyright')}</p>
        </div>
      </Container>
    </footer>
  );
}
