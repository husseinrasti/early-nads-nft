import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import Image from "next/image";
import monadLogo from "@public/logo.png";
import { client } from "./const/client";
import { contract } from "./const/contract";
import { monadChain } from "./const/chain";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Early Nads NFT",
  description:
    "Early Nads NFT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <div className="container">
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer>
      <div className="items-center">
        <p className="items-center justify-center"
          style={{
            color: "rgb(149, 149, 149)",
          }}
        >
          Created by&nbsp;
          <a href="https://x.com/hr0xCrypto" target="_blank" className="md:font-bold" style={{
            color: "rgb(255, 255, 255)",
          }}
          >
            cipHer
          </a>
        </p>
      </div>
    </footer>
  );
}

function Header() {
  return (
    <div className="navbar">
      <div className="navLinks">
        {contract && (
          <Link href={`profile`}>
            <p>Profile</p>
          </Link>
        )}
      </div>
      <header className="flex flex-row items-center max-w-screen-lg mx-auto">
        <Link href={`/`}>
          <Image
            src={monadLogo}
            alt=""
            className="size-[48px] md:size-[48px]"
            style={{
              filter: "drop-shadow(0px 0px 24px #a726a9a8)",
            }}
          />
        </Link>
        <Link href={`/`}>
          <h1 className="text-2xl md:text-2xl font-semibold md:font-bold tracking-tighter text-zinc-100">
            NFT Claim App
          </h1>
        </Link>
      </header>
      <ConnectButton
        client={client}
        chain={monadChain}
      />
    </div>
  );
}