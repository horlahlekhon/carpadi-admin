import {Toaster} from "react-hot-toast";

const CPToast = () => {
    return (<div>
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    border: '1px solid #243773',
                    padding: '16px',
                    fontWeight: 'bold',
                    color: '#243773'
                },
                iconTheme: {
                    primary: '#243773',
                    secondary: '#FFFAEE'
                }
            }}
        />
    </div>)
}

export default CPToast;