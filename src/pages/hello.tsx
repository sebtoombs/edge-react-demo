import { EdgeCtx } from "../../types";

interface HelloPageProps {
  name: string;
}
const HelloPage = ({ name }: HelloPageProps) => {
  const now = new Date();
  const nowFmt = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  return (
    <div>
      <h1>
        Hello, {name} - {nowFmt}
      </h1>
    </div>
  );
};

export default HelloPage;

export const getEdgeProps = (ctx: EdgeCtx) => {
  const { params } = ctx;
  const name = params?.name || "Unknown";
  return {
    props: {
      name,
    },
    revalidate: 5,
  };
};
