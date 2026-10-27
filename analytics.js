// ==========================================================================
// Abdallah Abdelhafeez - Google Analytics 4 (GA4) Tracking Script
// Features:
// 1. Automatic GA4 loading via Measurement ID
// 2. Real-time Pageview & Visitor tracking
// 3. CV Download Event Tracking (Academic CV vs Data Analyst CV)
// 4. Recruiter / Company Link Tracking (?ref=company_name or ?utm_source=...)
// 5. Social & Portfolio Project Interaction Tracking
// ==========================================================================

// 👇 STEP 1: Replace 'G-XXXXXXXXXX' with your own Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-J8222C1N45';

// Global event tracking helper
window.trackEvent = function(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

// Initialize Google Analytics 4
(function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.info(
      "%c[Google Analytics 4]%c Set your GA_MEASUREMENT_ID in 'analytics.js' to start tracking visitors.",
      "color: #4895EF; font-weight: bold;",
      "color: #888;"
    );
    // Provide a safe fallback gtag so tracking calls never error
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    return;
  }

  // Load official gtag.js library asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });

  // Track recruiter / campaign query params
  trackRecruiterAttribution();
})();

// Detect when recruiters or specific companies open your portfolio
// Example link: https://your-site.github.io/?ref=Google or ?ref=Vodafone
function trackRecruiterAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const recruiterTag = params.get('ref') || params.get('recruiter') || params.get('company') || params.get('utm_source');

    if (recruiterTag && !sessionStorage.getItem(`recruiter_logged_${recruiterTag}`)) {
      sessionStorage.setItem(`recruiter_logged_${recruiterTag}`, 'true');
      window.trackEvent('recruiter_visit', {
        event_category: 'Recruiter Outreach',
        recruiter_tag: recruiterTag,
        landing_page: window.location.pathname,
        referrer: document.referrer || 'direct'
      });
    }
  } catch (e) {
    // Gracefully handle any browser URLSearchParams limitations
  }
}

// Track interactive user events across the site
document.addEventListener('DOMContentLoaded', () => {
  // 1. Track CV Links & Button Clicks
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = (link.textContent || '').trim().toLowerCase();

    // CV Download / Open Links
    if (href.includes('cv.html') || href.toLowerCase().includes('.pdf') || text.includes('download cv')) {
      link.addEventListener('click', () => {
        let cvType = 'General CV';
        if (href.includes('Academic') || text.includes('academic')) {
          cvType = 'Academic CV';
        } else if (href.includes('Data_Analyst') || text.includes('data analyst')) {
          cvType = 'Data Analyst CV';
        }

        window.trackEvent('cv_download', {
          event_category: 'CV',
          event_label: cvType,
          file_name: href,
          page: window.location.pathname
        });
      });
    }

    // Social Media Links (LinkedIn, GitHub, Email)
    if (href.includes('linkedin.com')) {
      link.addEventListener('click', () => {
        window.trackEvent('social_click', {
          event_category: 'Social',
          platform: 'LinkedIn',
          url: href
        });
      });
    } else if (href.includes('github.com')) {
      link.addEventListener('click', () => {
        window.trackEvent('social_click', {
          event_category: 'Social',
          platform: 'GitHub',
          url: href
        });
      });
    } else if (href.startsWith('mailto:')) {
      link.addEventListener('click', () => {
        window.trackEvent('social_click', {
          event_category: 'Social',
          platform: 'Email'
        });
      });
    }

    // Project links / GitHub repositories
    if (link.classList.contains('btn-general') && (href.startsWith('http') || href.includes('github.com'))) {
      link.addEventListener('click', () => {
        const parentCard = link.closest('.project-card') || link.closest('.content-section') || link.parentElement;
        const heading = parentCard ? (parentCard.querySelector('h3, h2')?.textContent || 'Project') : 'Project';
        window.trackEvent('project_view', {
          event_category: 'Projects',
          project_name: heading.trim(),
          project_url: href
        });
      });
    }
  });

  // 2. Track Dedicated CV Viewer interactions on cv.html
  const mainDownloadBtn = document.getElementById('btnDownload');
  if (mainDownloadBtn) {
    mainDownloadBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.cv-toggle-btn.active');
      const cvName = activeTab ? activeTab.textContent.trim() : 'Active CV';
      window.trackEvent('cv_download', {
        event_category: 'CV Viewer',
        event_label: cvName,
        source: 'Toolbar Button'
      });
    });
  }

  const fallbackDownloadBtn = document.getElementById('fallbackDownload');
  if (fallbackDownloadBtn) {
    fallbackDownloadBtn.addEventListener('click', () => {
      window.trackEvent('cv_download', {
        event_category: 'CV Viewer',
        event_label: 'Fallback Download',
        source: 'Fallback Frame'
      });
    });
  }

  // Track switching between Academic CV and Data Analyst CV
  document.querySelectorAll('.cv-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.trackEvent('cv_tab_switch', {
        event_category: 'CV Viewer',
        cv_selected: btn.textContent.trim()
      });
    });
  });
});
