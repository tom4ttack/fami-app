import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// ─── Firebase Messaging Service Worker ───────────────────────────────────────
// Dev 서버에서 /firebase-messaging-sw.js 를 직접 서빙합니다.
// 프로덕션 배포 시에는 firebase.ts 의 config 와 동일한 값으로 수정 후
// public/firebase-messaging-sw.js 파일로 복사하세요.
function fcmSwPlugin(): Plugin {
  const swContent = `
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// ⚠️ src/app/services/firebase.ts 의 firebaseConfig 와 동일하게 교체
firebase.initializeApp({
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification && payload.notification.title ? payload.notification.title : (payload.data && payload.data.title ? payload.data.title : "병해 알림");
  const body  = payload.notification && payload.notification.body  ? payload.notification.body  : (payload.data && payload.data.body  ? payload.data.body  : "");
  const level = payload.data && payload.data.level ? payload.data.level : "info";
  self.registration.showNotification(title, {
    body: body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "fcm-" + (payload.data && payload.data.zone ? payload.data.zone : "") + "-" + Date.now(),
    data: payload.data,
    requireInteraction: level === "danger",
  });
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow("/");
    })
  );
});
`.trim()

  return {
    name: 'fcm-sw',
    configureServer(server) {
      server.middlewares.use('/firebase-messaging-sw.js', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.setHeader('Service-Worker-Allowed', '/')
        res.end(swContent)
      })
    },
  }
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    fcmSwPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
