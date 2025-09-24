import './globals.css';
import Navbar from '../components/Navbar';
import RouteWipe from '../components/RouteWipe';
import ProjectReveals from '../components/ProjectReveals';
import Footer from '../components/Footer';
export const metadata = {
  title: 'Ashlyn Lee — Portfolio',
  description: 'Newspaper-styled portfolio with watercolor projects',
 icons: {
    icon: './favicon.png', 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">{children}</main>
        <ProjectReveals />
        <RouteWipe />
        <Footer />
      </body>
    </html>
  )
}
