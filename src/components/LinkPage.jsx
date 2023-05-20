import { Link } from "react-router-dom"

const LinkPage = () => {
    return (
        <section>
            <h1 className="text-2xl">Links</h1>
            <br />
            <h2 className="text-lg">Public</h2>
            <Link className="block" to="/login">Login</Link>
            <Link className="block" to="/register">Register</Link>
            <br />
            <h2 className="text-lg">Private</h2>
            <Link className="block" to="/">Home</Link>
            <Link className="block" to="/editor">Editors Page</Link>
            <Link className="block" to="/admin">Admin Page</Link>
        </section>
    )
}

export default LinkPage