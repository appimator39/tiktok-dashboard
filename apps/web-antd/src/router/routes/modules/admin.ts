import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: 'Admin',
    },
    name: 'Admin',
    path: '/admin',
    children: [
      {
        name: 'AdminDashboard',
        path: '/admin/dashboard',
        component: () => import('#/views/admin/dashboard/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:layout-dashboard',
          title: 'Dashboard',
        },
      },
      {
        name: 'AdminAnalytics',
        path: '/admin/analytics',
        component: () => import('#/views/admin/analytics/index.vue'),
        meta: {
          icon: 'lucide:area-chart',
          title: 'Analytics',
        },
      },
      {
        name: 'AdminActivityLog',
        path: '/admin/activity-log',
        component: () => import('#/views/admin/activity-log/index.vue'),
        meta: {
          icon: 'lucide:activity',
          title: 'Activity Log',
        },
      },
      {
        name: 'AdminGeneral',
        path: '/admin/general',
        component: () => import('#/views/admin/settings/general.vue'),
        meta: {
          icon: 'lucide:settings',
          title: 'General Settings',
        },
      },
      {
        name: 'AdminApiProviders',
        path: '/admin/api',
        component: () => import('#/views/admin/settings/api-providers.vue'),
        meta: {
          icon: 'lucide:plug',
          title: 'API Providers',
        },
      },
      {
        name: 'AdminGlobalContent',
        path: '/admin/global-content',
        component: () => import('#/views/admin/settings/global-content.vue'),
        meta: {
          icon: 'lucide:book-open',
          title: 'Global Content',
        },
      },
      {
        name: 'AdminGlobalHeader',
        path: '/admin/global-header',
        component: () => import('#/views/admin/settings/global-header.vue'),
        meta: {
          icon: 'lucide:layout-panel-top',
          title: 'Global Header',
        },
      },
      {
        name: 'AdminGlobalFooter',
        path: '/admin/global-footer',
        component: () => import('#/views/admin/settings/global-footer.vue'),
        meta: {
          icon: 'lucide:layout-panel-bottom',
          title: 'Global Footer',
        },
      },
      {
        name: 'AdminRobots',
        path: '/admin/robots',
        component: () => import('#/views/admin/settings/robots.vue'),
        meta: {
          icon: 'lucide:bot',
          title: 'Robots',
        },
      },
      {
        name: 'AdminSitemap',
        path: '/admin/sitemap-generator',
        component: () => import('#/views/admin/settings/sitemap.vue'),
        meta: {
          icon: 'lucide:map',
          title: 'Sitemap Generator',
        },
      },
      {
        name: 'AdminChangePassword',
        path: '/admin/change-password',
        component: () => import('#/views/admin/settings/change-password.vue'),
        meta: {
          icon: 'lucide:key',
          title: 'Change Password',
        },
      },
      {
        name: 'AdminContactMessages',
        path: '/admin/contact-messages',
        component: () => import('#/views/admin/contact-messages/index.vue'),
        meta: {
          icon: 'lucide:mail',
          title: 'Contact Messages',
        },
      },
      {
        name: 'AdminGoogleAdsense',
        path: '/admin/google-adsense',
        component: () => import('#/views/admin/google-adsense/index.vue'),
        meta: {
          icon: 'lucide:badge-dollar-sign',
          title: 'Google Adsense',
        },
      },
      {
        name: 'AdminLanguages',
        path: '/admin/languages',
        component: () => import('#/views/admin/languages/index.vue'),
        meta: {
          icon: 'lucide:languages',
          title: 'Languages',
        },
      },
      {
        name: 'AdminLanguagePages',
        path: '/admin/language-pages',
        component: () => import('#/views/admin/languages/pages.vue'),
        meta: {
          icon: 'lucide:layers',
          title: 'Language Pages',
        },
      },
      {
        name: 'AdminLanguageHome',
        path: '/admin/language-home',
        component: () => import('#/views/admin/languages/home.vue'),
        meta: {
          icon: 'lucide:home',
          title: 'Language Home',
        },
      },
      {
        name: 'AdminLanguageMp3',
        path: '/admin/language-mp3',
        component: () => import('#/views/admin/languages/mp3.vue'),
        meta: {
          icon: 'lucide:music-2',
          title: 'Language MP3',
        },
      },
      {
        name: 'AdminLanguageStories',
        path: '/admin/language-stories',
        component: () => import('#/views/admin/languages/stories.vue'),
        meta: {
          icon: 'lucide:book-open-check',
          title: 'Language Stories',
        },
      },
      {
        name: 'AdminLanguageHow',
        path: '/admin/language-how',
        component: () => import('#/views/admin/languages/how.vue'),
        meta: {
          icon: 'lucide:help-circle',
          title: 'Language How',
        },
      },
      {
        name: 'AdminLanguageFaqs',
        path: '/admin/language-faqs',
        component: () => import('#/views/admin/languages/faqs.vue'),
        meta: {
          icon: 'lucide:message-circle-question',
          title: 'Language FAQs',
        },
      },
      {
        name: 'AdminLanguageSimplePage',
        path: '/admin/language-page-simple',
        component: () => import('#/views/admin/languages/simple-page.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: 'Language Simple Page',
        },
      },
      {
        name: 'AdminEditLanguage',
        path: '/admin/edit-language',
        component: () => import('#/views/admin/languages/edit.vue'),
        meta: {
          icon: 'lucide:edit-3',
          title: 'Edit Language',
        },
      },
      {
        name: 'AdminCustomPageCreate',
        path: '/admin/custom-page-create',
        component: () => import('#/views/admin/languages/custom-create.vue'),
        meta: {
          icon: 'lucide:plus-square',
          title: 'Custom Page Create',
        },
      },
      {
        name: 'AdminCustomPageEdit',
        path: '/admin/custom-page-edit',
        component: () => import('#/views/admin/languages/custom-edit.vue'),
        meta: {
          icon: 'lucide:pen-square',
          title: 'Custom Page Edit',
        },
      },
      {
        name: 'AdminBase',
        path: '/admin/base',
        component: () => import('#/views/admin/base/index.vue'),
        meta: {
          icon: 'lucide:layout-template',
          title: 'Base Layout',
        },
      },
    ],
  },
];

export default routes;
