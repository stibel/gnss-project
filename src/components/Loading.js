import React from "react";
import ReactLoading from "react-loading";

const Loading = ({ type, color, height }) => (
    <ReactLoading type={type} color={color} height={height} />
);

export default Loading;
