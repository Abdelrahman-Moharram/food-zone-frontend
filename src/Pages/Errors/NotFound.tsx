import { Link } from "react-router-dom"
import { HomeIcon, NotFoundIcon } from "../../Components/utils/Icons"

const NotFound = () => {
  return (
    <section className="lg:grid lg:h-screen lg:place-content-center">
        <div
            className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
        >
            <div className="max-w-prose text-left">
                <h1 className="font-extrabold text-primary text-[180px]">
                    <strong>404</strong>
                </h1>
                <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-14">
                    Sorry, we couldn't find this page.
                </h3>

                
                <div className="mt-12 flex gap-4 sm:mt-6">
                    <Link
                        className="flex items-center gap-3 rounded border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-primary/90"
                        to="/"
                    >
                        <HomeIcon /> Home
                    </Link>

                </div>
            </div>

            <NotFoundIcon />
        </div>
        </section>
  )
}

export default NotFound
