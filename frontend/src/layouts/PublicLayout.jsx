import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = ({ children }) => {
    return (
        <div className="layout-container min-h-screen flex flex-col">
            <Navbar />
            <main className="content flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;