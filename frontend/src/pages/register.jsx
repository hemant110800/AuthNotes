import React from "react";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    username: "",
    email:"",
    password: "",
    password2: "",
  });

  const [error, setError] = useState(null);

  const auth = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formFields);
    const response = await auth.registerHandler(formFields);
    console.log(response);
    if (response.status === 201) {
      setError(null);
      console.log("Register Successfully!!");
      navigate("/");
    } else {
      setError(response);

      setTimeout(() => {
        setError(null);
      }, [3000]);
    //   console.log(response);
    }
  };

  const fieldHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormFields((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className="w-75 bg-whiteContainer m-auto p-4 mt-4">
      <div
        className={
          error
            ? "alert alert-danger danger-alert danger-alert-animation"
            : "alert alert-danger danger-alert"
        }
        role="alert"
      >
        {error}
      </div>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="userName"
            name="username"
            onChange={fieldHandler}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            onChange={fieldHandler}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            onChange={fieldHandler}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            name="password2"
            onChange={fieldHandler}
          />
        </div>
        <div className="d-flex gap-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !(
                formFields.username.length > 0 && formFields.email.length > 0
              )
            }
          >
            Register
          </button>

          <div style={{ fontSize: "13px" }} className="mt-2">
            Already a User?{" "}
            <strong style={{ color: "#0d6efd" }}>
              <Link to="/login">Login here!</Link>
            </strong>
          </div>
        </div>

        {/* <div>New User? <Link to="/user/registration">Register here!</Link></div> */}
      </form>
    </div>
  );
};

export default Register;
