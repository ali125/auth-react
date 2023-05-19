import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="min-h-[100vh] flex items-center justify-center">
            <article className="text-white w-[30rem] rounded-md shadow bg-teal-700 p-5">
                <Outlet />
            </article>
        </main>
    )
}

export default Layout;
