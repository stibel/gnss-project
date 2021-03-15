import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import styled from"styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from "../components/Loading";

const PageWrapper = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column;
  width: 100vw;
  height: 90vh;
`

const HomeScreen = (props) => {

    const [apod, setApod] = useState(null);
    const [fetched, setFetched] = useState(false);

    const toastError = () => toast.error('Failed to fetch data from NASA API');

    const getAPOD = () => {

        fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(res => res.ok ? res.json() : toastError())
            .then(data => setApod(data)).then(fetched => setFetched(true))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        getAPOD()
    },[]);

    useEffect(() => {
        console.log(apod);
    }, [apod])

    return (
        <PageWrapper>
                home page
                <Link to={"/Load"}>Załaduj plika</Link>
                <Link to={"/Calc"}>Przelicz czas</Link>
            {fetched ?
                <div>
                    <p>{apod.date} : {apod.title}</p>
                    <a href={apod.url} target={"_blank"} rel={"noopener"}>Zobacz zdjęcie</a>
                </div>
                :
                <Loading type={"spin"} color={"#000000"} height={"20%"} />
            }
            <ToastContainer />
        </PageWrapper>
    )
}

export default HomeScreen