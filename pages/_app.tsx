import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="font-mono bg-slate-100 h-full flex">
      <div className="container m-auto">
        <div className="flex justify-center px-6">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyApp
