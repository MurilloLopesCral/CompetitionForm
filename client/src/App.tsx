import { ToastContainer } from "react-toastify";
import { Form } from "./components/Form";

function App() {
    return (
        <>
            <Form />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
                pauseOnHover
                draggable
                stacked
            />
        </>
    );
}

export default App;
