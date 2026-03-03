import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [svelte(), tailwindcss()],
	server: {
		proxy: {
			"/signin": "http://localhost:3000",
			"/login": "http://localhost:3000",
			"/data": "http://localhost:3000",
			"/share": "http://localhost:3000",
			"/revoke": "http://localhost:3000",
			"/revokeAll": "http://localhost:3000",
			"/mycode": "http://localhost:3000",
			"/save": "http://localhost:3000",
			"/logout": "http://localhost:3000",
			"/sessions": "http://localhost:3000",
			"/friend": "http://localhost:3000",
			"/analytics": "http://localhost:3000",
		},
	},
});
