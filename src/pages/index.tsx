import MainLayout from "../components/layouts/MainLayout";

function HomePage() {
  return <div>Welcome to Next.js!</div>;
}

export default HomePage;

HomePage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
