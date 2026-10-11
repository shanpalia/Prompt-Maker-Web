import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Prompt Maker by PaliaAPK HUB",description:"Discover prompts. Copy. Create. Developer by Shanpalia."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
