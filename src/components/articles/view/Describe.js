import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, CardBody, Spinner } from "reactstrap";
import ErrorComponent from "../../common/ErrorComponent";
import { getArticleById } from "../../../services/api/Articles";

function ArticleDescribe() {
  const { articleId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["articleDetails", articleId],
    queryFn: () => getArticleById(articleId),
  });

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <Card>
      <CardBody>
        <div
          style={{ textAlign: "justify" }}
          dangerouslySetInnerHTML={{
            __html: data.data.detailsNewsDto.describe,
          }}
        ></div>
      </CardBody>
    </Card>
  );
}

export default ArticleDescribe;
