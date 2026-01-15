import withPWA from "next-pwa";

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: [
			"@prisma/client",
			"@prisma/adapter-libsql",
			"@libsql/client",
			"@libsql/isomorphic-ws"
		]
	}
};

export default withPWA({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	register: true,
	skipWaiting: true,
	buildExcludes: [/middleware-manifest.json$/],
	runtimeCaching: [
		{
			urlPattern: /^https?:\/\/.*\/(api|trpc)\/.*$/,
			handler: "NetworkFirst",
			options: {
				cacheName: "api-cache",
				networkTimeoutSeconds: 5,
				expiration: {
					maxEntries: 100,
					maxAgeSeconds: 60 * 60
				}
			}
		},
		{
			urlPattern: ({ request }) => request.destination === "document",
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "page-cache"
			}
		},
		{
			urlPattern: ({ request }) =>
				["style", "script", "worker"].includes(request.destination),
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "asset-cache"
			}
		},
		{
			urlPattern: ({ request }) => request.destination === "image",
			handler: "CacheFirst",
			options: {
				cacheName: "image-cache",
				expiration: {
					maxEntries: 200,
					maxAgeSeconds: 60 * 60 * 24 * 30
				}
			}
		}
	]
})(nextConfig);
