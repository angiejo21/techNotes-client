import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";
import usePersist from "../../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";

function PersistLogin() {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRun = useRef();
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isError, isSuccess, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRun.current === true || process.env.NODE_ENV !== "development") {
      //React 18 strict mode runs twice in development
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };
      if (!token && persist) verifyRefreshToken();
    }
    return () => (effectRun.current = true);
    //eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    //persist:no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist:yes, token:no
    console.log("loading");
    content = <PulseLoader color={"#FFF"} />;
  } else if (isError) {
    //persist:yes, token:no
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist:yes, token:yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist:yes, token:yes
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
}

export default PersistLogin;
