import './Home.css'
import { useLanguage } from '../contexts/LanguageContext'

export default function Home({ onStart }) {
  const { t } = useLanguage()
  return (
    <div className="home">
      <div className="home__card">
        <div className="home__title">{t('homeTitle')}</div>
        <div className="home__subtitle">{t('homeSubtitle')}</div>

        <div className="home__desc">
          {t('homeDesc')}
          <span className="home__kw">{t('home_kw_assignment_overwrites')}</span>
          <span className="home__sep">/</span>
          <span className="home__kw">{t('home_kw_copy_by_value')}</span>
          <span className="home__sep">/</span>
          <span className="home__kw">{t('home_kw_temporary_variable')}</span>
        </div>

        <div className="home__actions">
          <button className="home__startBtn" type="button" onClick={onStart}>
            {t('start')}
          </button>
        </div>
      </div>
    </div>
  )
}


