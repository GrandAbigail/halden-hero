import Nav from './components/Nav'
import ScrollStory from './components/ScrollStory'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <ScrollStory />
        <footer className="bg-pine-deep px-6 py-16 text-mist/60 md:px-[6vw]">
          <p className="max-w-[40rem] text-sm leading-relaxed">
            Halden is a financial technology company, not a bank. Banking services
            provided by partner banks, Member FDIC. Yield shown is illustrative.
          </p>
        </footer>
      </main>
    </>
  )
}
