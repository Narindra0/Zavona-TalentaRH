import Navbar from '../components/Navbar';

const PublicLayout = ({ children }) => {
    return (
        <div className="layout-container">
            <Navbar />
            <main className="content">
                {children}
            </main>
            {/* On pourra ajouter un Footer ici plus tard */}
        </div>
    );
};

export default PublicLayout;