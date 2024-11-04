import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { Link,  useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { useSelector, useDispatch } from "react-redux";
//import { Search } from "lucide-react";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch()

  /// const [isLoading, setIsLoading] = useState(false)

  const [register, { isLoading }] = useRegisterMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";

  const userInfo = useSelector((state) => state.auth);

  console.log(userInfo);

//   useEffect(() => {
//     if (userInfo) {
//       navigate("/");
//     }
//   }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password does not match");
    } else {
      try {
        //try tp send the data to the database
        const res = await register({username, email, password}).unwrap();

        dispatch(setCredentials({...res}))
        navigate(redirect);
        toast.success("User registered successfully")
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message);
      }
    }
  };

  return (
    <div className="flex flex-row ">
      <section className="pl-4 md:pl-[15rem] flex flex-wrap">
        <div className="mr-5 md:mr-[6rem] mt-[3rem]">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>

          <form
            onSubmit={submitHandler}
            className="container w-[300px] md:w-[40rem]"
          >
            <div className="my-[2rem]">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="text"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-white">
              already have an account?{" "}
              <Link to="/login" className="text-pink-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
      <div>
        <img
          src="https://www.wordstream.com/wp-content/uploads/2021/07/google-shopping-feed-ecommerce-final.jpg"
          alt="shop"
          className="h-full w-full xl:block md:hidden rounded-lg"
        />
      </div>
    </div>
  );
};

export default Register;