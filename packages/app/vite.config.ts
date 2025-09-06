import { presetDaisy } from "@ameinhardt/unocss-preset-daisy";
import react from "@vitejs/plugin-react";
import { presetWind4 } from "unocss";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({ babel: { plugins: ["relay"] } }),
		UnoCSS({
			presets: [presetWind4({}), presetDaisy({ themes: ["lofi --default"] })],
		}),
	],
});
