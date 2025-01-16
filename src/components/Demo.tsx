"use client";

import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { Input } from "../components/ui/input"
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import sdk, {
    AddFrame,
  type Context, 
  SignIn as SignInCore,
} from "@farcaster/frame-sdk";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId,
} from "wagmi";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
import { useSession } from "next-auth/react"
import { createStore } from 'mipd'
import { Label } from "~/components/ui/label";


export default function Demo(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [txHash, setTxHash] = useState<string | null>(null);

  const [added, setAdded] = useState(false);
  const [addFrameResult, setAddFrameResult] = useState("");

  const cards = [
    <Frame1 key="frame1" />,
    <Frame key="frame" context={context} />,
    <SignedIn key="signedIn" />,
    <OpenLink key="openLink" />,
    <ViewProfile key="viewProfile" />,
    <CloseFrame key="closeFrame" />,
    <AddFrameClient key="addFrameClient" />,
    <Notification key="notification" />,
    <Wallet key="wallet" />,

  ];
  const card = [
    <Frame1 key="frame1" />,
    <FrameD key="frame" />,
    <SignedIn key="signedIn" />,
    <OpenLinkD key="openLink" />,
    <Pop key="popup" />,
    <CloseFrame key="closeFrame" />,
    <AddFrameClient key="addFrameClient" />,
    <Notification key="notification" />,
    <Wallet key="wallet" />,
    <LiveFrameD key="frame"/>
  ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const togglePopup = () => {
      setIsPopupVisible(!isPopupVisible);
    };
  
    const handleClickOutside = (event: React.MouseEvent<Document, MouseEvent>) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupVisible(false);
      }
    };

    useEffect(() => {
      const handleMouseDown = (event: MouseEvent) => handleClickOutside(event as unknown as React.MouseEvent<Document, MouseEvent>);
      document.addEventListener('mousedown', handleMouseDown);
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
      };
    }, []);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const {
    signTypedData,
    error: signTypedError,
    isError: isSignTypedError,
    isPending: isSignTypedPending,
  } = useSignTypedData();

  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  const {
    switchChain,
    error: switchChainError,
    isError: isSwitchChainError,
    isPending: isSwitchChainPending,
  } = useSwitchChain();

  const handleSwitchChain = useCallback(() => {
    switchChain({ chainId: chainId === base.id ? optimism.id : base.id });
  }, [switchChain, chainId]);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      setAdded(context.client.added);

      console.log("Calling ready");
      sdk.actions.ready({});

const store = createStore()

store.subscribe(providerDetails => {
  console.log("PROVIDER DETAILS", providerDetails)
})

    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);


  // const close = useCallback(() => {
  //   sdk.actions.close();
  // }, []);

  const addFrame = useCallback(async () => {
    try {
      // setNotificationDetails(null);

      const result = await sdk.actions.addFrame();

      // if (result.notificationDetails) {
      //   setNotificationDetails(result.notificationDetails);
      // }
      setAddFrameResult(
        result.notificationDetails
          ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
          : "Added, got no notification details"
      );
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }
      
      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  // const sendNotification = useCallback(async () => {
  //   setSendNotificationResult("");
  //   if (!notificationDetails || !context) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/send-notification", {
  //       method: "POST",
  //       mode: "same-origin",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         fid: context.user.fid,
  //         notificationDetails,
  //       }),
  //     });

  //     if (response.status === 200) {
  //       setSendNotificationResult("Success");
  //       return;
  //     } else if (response.status === 429) {
  //       setSendNotificationResult("Rate limited");
  //       return;
  //     }

  //     const data = await response.text();
  //     setSendNotificationResult(`Error: ${data}`);
  //   } catch (error) {
  //     setSendNotificationResult(`Error: ${error}`);
  //   }
  // }, [context, notificationDetails]);

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        // call yoink() on Yoink contract
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
        data: "0x9846cd9efc000023c0",
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

  const signTyped = useCallback(() => {
    signTypedData({
      domain: {
        name: "Frames v2 Demo",
        version: "1",
        chainId,
      },
      types: {
        Message: [{ name: "content", type: "string" }],
      },
      message: {
        content: "Hello from Frames v2!",
      },
      primaryType: "Message",
    });
  }, [chainId, signTypedData]);



  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  
  function Wallet() {
    return (
      <div>
      <h1 className="text-center text-2xl font-semibold">Wallet</h1>
      <h1 className="text-center mb-2 text-xs font-medium">You can connect your wallet and make on-chain transactions within the frame.</h1>

      {address && (
        <div className="my-2 text-xs">
         Your Address: <pre className="inline">{truncateAddress(address)}</pre>
        </div>
      )}

      {chainId && (
        <div className="my-2 text-xs">
          Chain ID: <pre className="inline">{chainId}</pre>
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() =>
            isConnected
              ? disconnect()
              : connect({ connector: config.connectors[0] })
          }
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>

      <div className="mb-4">
        <SignMessage />
      </div>

      {isConnected && (
        <>
          <div className="mb-4">
            <SendEth />
          </div>
          <div className="mb-4">
            <Button
              onClick={sendTx}
              disabled={!isConnected || isSendTxPending}
              isLoading={isSendTxPending}
            >
              Send Transaction (contract)
            </Button>
            {isSendTxError && renderError(sendTxError)}
            {txHash && (
              <div className="mt-2 text-xs">
                <div>Hash: {truncateAddress(txHash)}</div>
                <div>
                  Status:{" "}
                  {isConfirming
                    ? "Confirming..."
                    : isConfirmed
                    ? "Confirmed!"
                    : "Pending"}
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <Button
              onClick={signTyped}
              disabled={!isConnected || isSignTypedPending}
              isLoading={isSignTypedPending}
            >
              Sign Typed Data
            </Button>
            {isSignTypedError && renderError(signTypedError)}
          </div>
          <div className="mb-4">
            <Button
              onClick={handleSwitchChain}
              disabled={isSwitchChainPending}
              isLoading={isSwitchChainPending}
            >
              Switch to {chainId === base.id ? "Optimism" : "Base"}
            </Button>
            {isSwitchChainError && renderError(switchChainError)}
          </div>
        </>
      )}
    </div>
    );
  }
  function AddFrameClient() {
    return (
  
  
      <div>
        <h1 className="text-center text-2xl font-semibold">Add Frame</h1>
        <h1 className="text-center mb-2 text-xs font-medium">With addFrame, you can prompt users to add your frame to the Frames tab.</h1>   
  
      <div className="mb-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            sdk.actions.addFrame
          </pre>
        </div>
        {addFrameResult && (
          <div className="mb-2 text-sm">
            Add frame result: {addFrameResult}
          </div>
        )}
        <Button onClick={addFrame} disabled={added}>
          Add frame to client
        </Button>
      </div>

      <div className="text-center font-semibold">
  Frame added: 
  <span className="ml-1">{added ? "YES" : "NO"}</span>
</div>

    </div>
    );
  }

  const reply =  encodeURIComponent(
    `Hey! Can you add me to the dev chat, please?`
    );
    const closePopup = () => {
      setIsPopupVisible(false);
    };
    function Pop() {
      return (
    <div className="relative">
      <ViewProfileD/>
      <Button
            onClick={togglePopup}
            >
        View Profile
      </Button>
    
          {isPopupVisible && (
            <div
              ref={popupRef}
              className="mt-5 flex justify-center items-center p-2 border-[#8a63d2] border-4 bg-white shadow-lg rounded-lg w-full"
            >
                        <button
            onClick={closePopup}
            className="absolute top-2 right-2 text-black text-xl font-bold focus:outline-none"
          >
            ×
          </button>
              <Profile/>

            </div>
          )}
        </div>
    
    
      );
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
  function Scroll() {
    return (
      <div className="w-auto bg-slate-900">
      {/* Header */}
      {/* <header className="sticky top-0 bg-white shadow-lg"> */}
      <header className="bg-white shadow-lg">
      <h1 className="text-3xl font-bold text-[#8a63d2] hover:scale-105 transition-transform text-center">{title}</h1>
        <div className="container items-center p-3">
          <h1 className="text-3xl font-bold text-[#8a63d2] hover:scale-105 transition-transform text-center">Farcaster Frames v2</h1>
        </div>
      </header>
  
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center py-20 h-[calc(100vh-80px)]">
      <h2 className="text-4xl sm:text-5xl font-black text-white drop-shadow-xl animate-pulse px-4">
      Create Your First V2 Frame Today!
    </h2>
  
    <div className="flex flex-col mt-10">
    <button
          className="bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('card')}
          >
  Let&apos;s Get Started 🚀
  </button>

  <button
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('docs')}
        >
  Docs
  </button>
  <button
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => sdk.actions.openUrl( `https://github.com/cashlessman/HACKATHON`)}        >
  GitHub &#x2197;
  </button>
  <button
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('liveFrame')}
          >
Live Frames  </button>
  <button
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('github')}
          >
  Open Source Repositories
  </button>
    </div>
  </section>
  <section id="card">
  <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
      <div className="w-80 p-3 bg-blue-100 rounded-lg shadow-lg">
        {cards[currentIndex]}
      </div>

      <div className="mt-6 flex space-x-4">
        {/* Hide "Previous" button when index is 0 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous
          </button>
        )}

        {/* Display "Explore" when index is 0 */}
        {currentIndex === 0 ? (
          <button
          onClick={handleNext}

            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Explore
          </button>
        ) : currentIndex === cards.length - 1 ? (
          <button
          onClick={() => scrollToSection('docs')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Docs
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>  </section>
  
      {/* Features Section */}
      <section id="docs" className="container mx-auto grid md:grid-cols-3 gap-3 p-5 text-center">
      {[
        {
          title: "Introduction",
          url: "https://docs.farcaster.xyz/developers/frames/v2/",
          description: "Frames v2 is a full-screen interactive canvas based on HTML, CSS, and JavaScript."
        },
        {
          title: "Getting Started",
          url: "https://docs.farcaster.xyz/developers/frames/v2/getting-started",
          description: "Build your first frame by setting up a Next.js app and integrating the Farcaster Frame SDK."
        },
        {
          title: "Specification",
          url: "https://docs.farcaster.xyz/developers/frames/v2/spec",
          description: "Discover Frame URL specifications, client SDK API, and features like authentication and notifications."
        },
        {
          title: "Resources",
          url: "https://docs.farcaster.xyz/developers/frames/v2/resources",
          description: "Explore example projects, videos, tools, and learning resources."
        },
        {
          title: "Developer Tools",
          url: "https://warpcast.com/~/developers/frames",
          description: "Test and validate your frames in a live environment with the Developer Playground."
        },
        {
          title: "Build Your First Frame",
          url: "https://github.com/cashlessman/HACKATHON?tab=readme-ov-file#frames-v2-setup",
          description: "Go through this step by step guide to build your first frame"
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="bg-blue-100 shadow-lg rounded-lg p-3 hover:scale-105 transition-transform flex items-center justify-center flex-col"      >
          <h3
            className="text-2xl font-bold text-purple-700 group-hover:underline cursor-pointer"
            onClick={() => sdk.actions.openUrl(feature.url)}
          >
            {feature.title} &#x2197;
          </h3>
          <p className="text-gray-600 mt-3">{feature.description}</p>
        </div>
      ))}
  </section>
  <section className="flex flex-col w-full bg-slate-900 flex items-center justify-center text-white h-[calc(100vh-80px)]">
  <div id="liveFrame" className="mb-4"> 
    <h1 className="text-center mb-5 font-bold text-2xl">Live Frames</h1>

      <div className="grid grid-cols-2 gap-1 p-3">
      <a
          href="https://warpcast.com/~/frames/launch?domain=degen-v2.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 ml-2 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
          DEGEN
        </a>
        <a
          href="https://warpcast.com/~/frames/launch?domain=around-joined.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 ml-2 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
          Joined Around
        </a>
        <a
          href="https://warpcast.com/~/frames/launch?domain=yoink.party"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 ml-2 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
          Yonik!
        </a>
        <a
          href="https://warpcast.com/~/frames/launch?domain=app.payflow.me"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 ml-2 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
Payflow        </a>
<a
          href="https://warpcast.com/~/frames/launch?domain=weeklyhackathon.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 ml-2 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
weekly $hackathon       </a>
<a
          href="https://warpcast.com/~/frames/launch?domain=framesgiving.anky.bot"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-6 mt-3 ml-2 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
Anky       </a>
</div>
    </div>
    <div  id="github" className="mb-4">
    <h1 className="text-center mb-5 font-bold text-2xl">Open Source Repositories</h1>

      <div className="grid grid-cols-2 gap-3 p-1">
    <button
      className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
      onClick={() => sdk.actions.openUrl('https://github.com/warpcast/scores-frame')}
    >
      Warpcast Rewards
    </button>
    <button
      className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
      onClick={() => sdk.actions.openUrl('https://github.com/horsefacts/yoink-devcon')}
    >
      Yoink!
    </button>
    <button
      className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
      onClick={() => sdk.actions.openUrl('https://github.com/horsefacts/frames-v2-swap-demo')}
    >
      Swap Demo
    </button>
    <button
      className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
      onClick={() => sdk.actions.openUrl('https://github.com/horsefacts/interface')}
    >
      Uniframe
    </button>
</div>
    </div>
    <div className="text-white py-3" style={{ backgroundColor: '#8a63d2' }}>
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold">Join Devs Group Chat</h2>
      <div className="p-3 rounded-lg">
        <img src="https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/dwr-cast.png" alt="dwr's cast" className="rounded-lg" />
      </div>
      <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-pink-400 hover:text-white transition-colors" onClick={() => sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${reply}&parentCastHash=0x72baa04f953dbdd70dcadd773c6533209d5e574d`)}>
        Reply
      </button>
      <button className="ml-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-pink-400 hover:text-white transition-colors" onClick={() => sdk.actions.openUrl( `https://warpcast.com/~/inbox/create/3?text=Hey! Can you add me to the dev chat, please?`)}>
        Send DC
      </button>
    </div>
  </div>
  </section>
  
      {/* Call to Action */}

  
  
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-5">
      <div className="container mx-auto text-center">
    <p>
      Made with <span className="text-red-500">&hearts;</span> by <span className="text-blue-500" onClick={() =>sdk.actions.viewProfile({ fid: 268438 })}>cashlessman.eth</span>.
    </p>
  </div>
  
      </footer>
    </div>
  
  
    );
  }
  if (!context?.user.fid)
return (
  <div className="w-auto bg-slate-900">
    {/* Header */}
    <header className="bg-white shadow-lg">
      <div className="container items-center p-3">
        <h1 className="text-3xl font-bold text-[#8a63d2] hover:scale-105 transition-transform text-center">Farcaster Frames v2</h1>
      </div>
    </header>

    {/* Hero Section */}
    <section className="flex flex-col justify-center items-center text-center py-20 h-[calc(100vh-80px)]">
      <h2 className="text-4xl sm:text-5xl font-black text-white drop-shadow-xl animate-pulse px-4">
        Create Your First V2 Frame Today!
      </h2>

      <div className="flex flex-col mt-10">
        <button
          className="bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('card')}
        >
          Let&apos;s Get Started 🚀
        </button>

        <button
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('docs')}
        >
          Docs
        </button>
        <a
          href="https://github.com/cashlessman/HACKATHON"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
          GitHub &#x2197;
        </a>
        <button
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold"
          onClick={() => scrollToSection('github')}
        >
          Open Source Repositories
        </button>
      </div>
    </section>

    <section id="card">
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-black">
        <div className="w-80 p-6 bg-blue-100 rounded-lg shadow-lg">
          {card[currentIndex]}
        </div>

        <div className="mt-6 flex space-x-4">
          {/* Hide "Previous" button when index is 0 */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous
            </button>
          )}

          {/* Display "Explore" when index is 0 */}
          {currentIndex === 0 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Explore
            </button>
          ) : currentIndex === cards.length - 1 ? (
            <button
              onClick={() => scrollToSection('docs')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Docs
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section
  id="docs"
  className="container mx-auto flex items-center justify-center h-screen p-5 mx-auto text-center"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    {[
      {
        title: "Introduction",
        url: "https://docs.farcaster.xyz/developers/frames/v2/",
        description:
          "Frames v2 is a full-screen interactive canvas based on HTML, CSS, and JavaScript.",
      },
      {
        title: "Getting Started",
        url: "https://docs.farcaster.xyz/developers/frames/v2/getting-started",
        description:
          "Build your first frame by setting up a Next.js app and integrating the Farcaster Frame SDK.",
      },
      {
        title: "Specification",
        url: "https://docs.farcaster.xyz/developers/frames/v2/spec",
        description:
          "Discover Frame URL specifications, client SDK API, and features like authentication and notifications.",
      },
      {
        title: "Resources",
        url: "https://docs.farcaster.xyz/developers/frames/v2/resources",
        description:
          "Explore example projects, videos, tools, and learning resources.",
      },
      {
        title: "Developer Tools",
        url: "https://warpcast.com/~/developers/frames",
        description:
          "Test and validate your frames in a live environment with the Developer Playground.",
      },
      {
        title: "Build Your First Frame",
        url: "https://github.com/cashlessman/HACKATHON?tab=readme-ov-file#frames-v2-setup",
        description:
          "Go through this step-by-step guide to build your first frame.",
      },
    ].map((feature, index) => (
      <div
        key={index}
        className="bg-blue-100 shadow-lg rounded-lg p-5 hover:scale-105 transition-transform flex flex-col items-center justify-center"
      >
        <a
          href={feature.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold text-purple-700 hover:underline cursor-pointer"
        >
          {feature.title} &#x2197;
        </a>
        <p className="text-gray-600 mt-3">{feature.description}</p>
      </div>
    ))}
  </div>
</section>


    <section id="github" className="flex flex-col w-full bg-slate-900 flex items-center justify-center text-white h-[calc(100vh-80px)]">
      <div className="mb-4">
        <h1 className="text-center mb-5 font-bold text-2xl">Open Source Repositories</h1>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://github.com/warpcast/scores-frame"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
          >
            Warpcast Rewards
          </a>
          <a
            href="https://github.com/horsefacts/yoink-devcon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
          >
            Yoink
          </a>
          <a
            href="https://github.com/horsefacts/frames-v2-swap-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
          >
            Swap Demo
          </a>
          <a
            href="https://github.com/horsefacts/interface"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#8a63d2] text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
          >
            Uniframe
          </a>
        </div>
      </div>
      <div className="text-white py-3" style={{ backgroundColor: '#8a63d2' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Join Devs Group Chat</h2>
          <div className="p-3 rounded-lg">
            <img src="https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/dwr-cast.png" alt="dwr's cast" className="rounded-lg" />
          </div>
          <a
            href={`https://warpcast.com/~/compose?text=${reply}&parentCastHash=0x72baa04f953dbdd70dcadd773c6533209d5e574d`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-pink-400 hover:text-white transition-colors"
          >
            Reply
          </a>
          <a
            href="https://warpcast.com/~/inbox/create/3?text=Hey! Can you add me to the dev chat, please?"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-pink-400 hover:text-white transition-colors"
          >
            Send DC
          </a>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-800 text-white py-5">
      <div className="container mx-auto text-center">
      <p>
  Made with <span className="text-red-500">&hearts;</span> by <a href="https://warpcast.com/cashlessman.eth" className="text-blue-500">cashlessman.eth</a>.
</p>


      </div>
    </footer>
  </div>
);

  return (

    <div style={{ 
      paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0 ,
    }}><Scroll/>
   
    </div>

  );
}

function SignMessage() {
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const {
    signMessage,
    data: signature,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const handleSignMessage = useCallback(async () => {
    if (!isConnected) {
      await connectAsync({
        chainId: base.id,
        connector: config.connectors[0],
      });
    }

    signMessage({ message: "Hello from Frames v2!" });
  }, [connectAsync, isConnected, signMessage]);

  return (
    <>
      <Button
        onClick={handleSignMessage}
        disabled={isSignPending}
        isLoading={isSignPending}
      >
        Sign Message
      </Button>
      {isSignError && renderError(signError)}
      {signature && (
        <div className="mt-2 text-xs">
          <div>Signature: {signature}</div>
        </div>
      )}
    </>
  );
}

function SendEth() {
  const { isConnected, chainId } = useAccount();
  const {
    sendTransaction,
    data,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const toAddr = useMemo(() => {
    // Protocol guild address
    return chainId === base.id
      ? "0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
      : "0xB3d8d7887693a9852734b4D25e9C0Bb35Ba8a830";
  }, [chainId]);

  const handleSend = useCallback(() => {
    sendTransaction({
      to: toAddr,
      value: 1n,
    });
  }, [toAddr, sendTransaction]);

  return (
    <>
      <Button
        onClick={handleSend}
        disabled={!isConnected || isSendTxPending}
        isLoading={isSendTxPending}
      >
        Send Transaction (eth)
      </Button>
      {isSendTxError && renderError(sendTxError)}
      {data && (
        <div className="mt-2 text-xs">
          <div>Hash: {truncateAddress(data)}</div>
          <div>
            Status:{" "}
            {isConfirming
              ? "Confirming..."
              : isConfirmed
              ? "Confirmed!"
              : "Pending"}
          </div>
        </div>
      )}
    </>
  );
}

function SignIn() {
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
  const [signInFailure, setSignInFailure] = useState<string>();
  const { data: session, status } = useSession()

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      setSigningIn(true);
      setSignInFailure(undefined);
      const nonce = await getNonce();
      const result = await sdk.actions.signIn({ nonce });
      setSignInResult(result);

      await signIn("credentials", {
        message: result.message,
        signature: result.signature,
        redirect: false,
      });
    } catch (e) {
      if (e instanceof SignInCore.RejectedByUser) {
        setSignInFailure("Rejected by user");
        return;
      }

      setSignInFailure("Unknown error");
    } finally {
      setSigningIn(false);
    }
  }, [getNonce]);

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false }) 
      setSignInResult(undefined);
    } finally {
      setSigningOut(false);
    }
  }, []);

  return (
    <>
      {status !== "authenticated" &&
        <Button
          onClick={handleSignIn}
          disabled={signingIn}
        >
          Sign In
        </Button>
      }
      {status === "authenticated" &&
        <Button
          onClick={handleSignOut}
          disabled={signingOut}
        >
          Sign out
        </Button>
      }
      {session &&
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">Session</div>
          <div className="whitespace-pre">{JSON.stringify(session, null, 2)}</div>
        </div>
      }
      {signInFailure && !signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
          <div className="whitespace-pre">{signInFailure}</div>
        </div>
      )}
      {signInResult && !signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
          <div className="whitespace-pre">{JSON.stringify(signInResult, null, 2)}</div>
        </div>
      )}
    </>
  );
}

function ViewProfile() {
  const [fid, setFid] = useState('268438');

  return (
    <>
      <div>
      <h1 className="text-center text-2xl font-semibold">viewProfile</h1>
      <h1 className="text-center mb-2 text-xs font-medium">With viewProfile, you can view a user&apos;s Farcaster profile within the frame.</h1>
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                sdk.actions.viewProfile
              </pre>
            </div>
        <Label className="text-xs font-semibold text-gray-500 mb-1" htmlFor="view-profile-fid">Fid:</Label>
        <Input
          id="view-profile-fid"
          type="number"
          value={fid}
          className="mb-2"
          onChange={(e) => { 
            setFid(e.target.value)
          }}
          step="1"
          min="1"
        />
      </div>
      <Button
        onClick={() => { sdk.actions.viewProfile({ fid: parseInt(fid) }) }}
      >
        View Profile
      </Button>
    </>
  );
}
const ViewProfileD = () => {
  const [fid, setFid] = useState('268438');

  return (
    <>
      <div>
      <h1 className="text-center text-2xl font-semibold">viewProfile</h1>
      <h1 className="text-center mb-2 text-xs font-medium">With viewProfile, you can view a user&apos;s Farcaster profile within the frame.</h1>
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                sdk.actions.viewProfile
              </pre>
            </div>
        <Label className="text-xs font-semibold text-gray-500 mb-1" htmlFor="view-profile-fid">Fid:</Label>
        <Input
          id="view-profile-fid"
          type="number"
          value={fid}
          className="mb-2"
          onChange={(e) => { 
            setFid(e.target.value)
          }}
          step="1"
          min="1"
        />
      </div>

    </>
  );
}
function Frame({ context }: { context: Context.FrameContext | undefined }) {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold"> Context</h1>
      <h1 className="text-center mb-2 text-xs font-medium">with Context you will have access to the following</h1>

    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
        {JSON.stringify(context, null, 2)}
      </pre>
    </div>
    </div>
  );
}
const contextD = {
  user: {
    fid: 268438,
    username: "cashlessman.eth",
    displayName: "cashlessman 🎩",
    pfpUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/a74b030e-2d92-405c-c2d0-1696f5d51d00/original",
    location: {
      placeId: "",
      description: ""
    }
  },
  client: {
    clientFid: 9152,
    added: false,
    safeAreaInsets: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }
};
function FrameD() {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold"> Context</h1>
      <h1 className="text-center mb-2 text-xs font-medium">with Context you will have access to the following</h1>

    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
        {JSON.stringify(contextD, null, 2)}
      </pre>
    </div>
    </div>
  );
}

function Profile() {
  return (
<div className="flex flex-col w-full h-full bg-[#FFF5EE] text-center font-sans rounded-lg w-max">
    <div className="flex items-center m-auto mt-3">
            <img
              src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/a74b030e-2d92-405c-c2d0-1696f5d51d00/original"
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
              />
    </div>
    <h2 className="text-lg font-bold mt-2">cashlessman.eth</h2>
    <div className="flex flex-row font-medium justify-center">
    <p className="text-gray-500">4K followers</p>

    <p className="text-gray-500 ml-4">570 following</p>
    </div>
    <p className="text-gray-500 font-medium">dev - @infobot</p>
    <p className="text-gray-500 font-medium mb-3">69 followers you know</p>

    </div>
  );
}
function SignedIn() {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">Sign In with Farcaster</h1>
      <h1 className="text-center mb-2 text-xs font-medium">With Sign In with Farcaster, you can link your frame to the user&apos;s Farcaster account.</h1>
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
        sdk.actions.signIn
      </pre>
    </div>
    <SignIn />
  </div>
  );
}
function OpenLink() {
  return (
    <div >
      <h1 className="text-center text-2xl font-semibold">openUrl</h1>
      <h1 className="text-center mb-2 text-xs font-medium">With openUrl, you can open a link outside of the frame.</h1>
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
        sdk.actions.openUrl
      </pre>
    </div>
    <Button onClick={()=> sdk.actions.openUrl("https://warpcast.com/cashlessman.eth")}>Open Warpcast Profile</Button>
  </div>
  );
}
function OpenLinkD() {
  return (
    <div >
      <h1 className="text-center text-2xl font-semibold">openUrl</h1>
      <h1 className="text-center mb-2 text-xs font-medium">With openUrl, you can open a link outside of the frame.</h1>
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
        sdk.actions.openUrl
      </pre>
    </div>
    <div className="flex justify-center">
    <a
          href="https://warpcast.com/cashlessman.eth"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
          Open Warpcast Profile &#x2197;
        </a>
        </div>
  </div>
  );
}
function LiveFrameD() {
  return (
    <div >
      <h1 className="text-center text-2xl font-semibold">Live Frames</h1>
      <h1 className="text-center mb-2 text-xs font-medium">Check out Live Frames on Warpcast</h1>

    <div className="flex justify-center">
    <a
          href="https://warpcast.com/~/frames"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8a63d2] text-white px-6 py-3 mt-3 rounded-lg hover:bg-purple-600 transition-all font-bold text-center"
        >
          Open Warpcast &#x2197;
        </a>
        </div>
  </div>
  );
}

function Frame1() {
  return (
    <div >
      <h1 className="text-center text-2xl font-semibold">What distinguishes Frames v2 from a webpage?</h1>
 
  </div>
  );
}

function CloseFrame() {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">close</h1>
      <h1 className="text-center mb-2 text-xs font-medium">With close, you can exit the frame.</h1>
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
        sdk.actions.close
      </pre>
    </div>
    <Button onClick={close}>Close Frame</Button>
  </div>
  );
}

function Notification() {
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-center text-2xl font-semibold">Notification</h1>
      <h1 className="text-center mb-2 text-xs font-medium">You can also send in app notifications from your frame</h1>
      <div className="rounded-lg">
        <img
          src="https://raw.githubusercontent.com/cashlessman/images/refs/heads/main/reward-notification.png"
          alt="dwr's cast"
          className="rounded-lg mx-auto max-w-full"
        />
      </div>

    </div>


  );
}

const scrollToSection = (id:string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth', // Enables smooth scrolling
      block: 'start', // Aligns the section at the top
    });
  } else {
    console.warn(`Element with ID "${id}" not found.`);
  }
};



const renderError = (error: Error | null) => {
  if (!error) return null;
  if (error instanceof BaseError) {
    const isUserRejection = error.walk(
      (e) => e instanceof UserRejectedRequestError
    );

    if (isUserRejection) {
      return <div className="text-red-500 text-xs mt-1">Rejected by user.</div>;
    }
  }

  return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
};
