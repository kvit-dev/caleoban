import "./globals.css";

export const metadata = {
  title: "Caleoban",
  description: "Система управління завданнями",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const savedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            })()
          `
        }} />
      </head>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}