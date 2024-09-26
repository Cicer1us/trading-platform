import ErrorPage from 'pagesContent/Error/ErrorPage';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <ErrorPage displayMessage={'404 page not found.'} redirectToHomepage={true} />
    </>
  );
};

export default NotFoundPage;
