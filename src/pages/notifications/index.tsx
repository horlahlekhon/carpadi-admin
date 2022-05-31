import MainLayout from "../../components/layouts/MainLayout";

function NotificationsPage() {
  return <div>Notifications</div>;
}

export default NotificationsPage;

NotificationsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
