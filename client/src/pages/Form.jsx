/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchParticularForms } from '../utils/APIRoutes.js';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

export const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      // text: 'Chart.js Bar Chart',
    },
    maintainAspectRatio: false,
  },
};

export default function Form() {
  const navigate = useNavigate();
  const [form, setForm] = useState([]);
  const [report, setReport] = useState({
    name: '',
    data: [],
  });
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      if (params.id !== '') {
        setIsLoading(true);
        const { data } = await axios.get(
          `${fetchParticularForms}/${params.id}`
        );
        data && setIsLoading(false);
        if (data.status && data.response.length === 0) {
          !toast.isActive('sur-form') &&
            toast.warning(`No Responses`, {
              toastId: 'sur-form',
              position: 'top-center',
              autoClose: 5000,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: 'dark',
            });
          setTimeout(() => {
            navigate('/admin/home');
          }, 5800);
        } else {
          setForm(data.response);
          setReport({
            name: data.report.surveyName,
            data: data.report.questions,
          });
        }
      }
    }
    fetchForm();
  }, [params.id]);
  return (
    <Container>
      <ToastContainer />
      {isLoading && <Loader />}
      <div className="form">
        <div className="header">
          <h2>{report.name}</h2>
          <h4>
            Total Responses <span>{form?.length}</span>
          </h4>
        </div>
        <div className="hr"></div>
        <div className="report">
          {report.data.length > 0 &&
            report.data.map((r, index) => {
              return (
                <div className="wrap" key={r.questionId}>
                  <div className="question">{r.question}</div>
                  <div className="wrap-chart">
                    {r.answerType === 'radio-btn' && (
                      <Pie
                        datasetIdKey={r.id}
                        data={{
                          labels: [...r.option],
                          datasets: [
                            {
                              label: '#no of votes',
                              data: [...r.answers],
                              backgroundColor: [...r.customBackground],
                              borderColor: [...r.customBorder],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{ maintainAspectRatio: false }}
                      />
                    )}
                    {(r.answerType === 'check-box' ||
                      r.answerType === 'drop-down') && (
                      <Bar
                        datasetIdKey={r.id}
                        data={{
                          labels: [...r.option],
                          datasets: [
                            {
                              label: `${r.question}`,
                              data: [...r.answers],
                              backgroundColor: [...r.customBackground],
                              borderColor: [...r.customBorder],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={barOptions}
                      />
                    )}
                    {r.answerType === 'text' && (
                      <div key={index} className="text-answers">
                        {form.map((iterator, indx) => {
                          return (
                            <div className="text" key={indx}>
                              {iterator.answers[index].option}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  /* padding: 3% 2%; */
  padding: 7px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  margin-right: 4px;
  ::-webkit-scrollbar {
    width: 6px;
    padding: 9px;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      143deg,
      hsl(270 100% 58%),
      hsl(265 100% 48%),
      hsl(260 100% 58%)
    );
    border-radius: 50px;
  }

  .form {
    height: fit-content;
    width: 70%;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    .header {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      h2 {
        font: 550 1.4rem var(--ralewayFont);
        color: #292929;
      }
      h4 {
        font: 400 1rem var(--openSansFont);
        color: #393939;
      }
    }
    .hr {
      height: 1px;
      width: 90%;
      margin: 0.8rem auto;
      background: hsl(0 0% 0% / 0.22);
    }
    .report {
      padding: 8px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .wrap {
        display: flex;
        flex-direction: column;
      }
      .question {
        font: 400 1rem var(--poppinsFont);
        padding: 6px;
        padding-left: 1rem;
        margin-bottom: 1rem;
      }
      .wrap-chart {
        width: 90%;
        height: 300px;
        align-self: center;
      }
    }
    .text-answers {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      .text {
        font: 400 1rem var(--poppinsFont);
        display: flex;
        gap: 0.5rem;
        padding: 9px 7px;
        background: hsl(260 100% 58% / 0.2);
        border-radius: 5px;
        color: hsl(0 0% 0% / 0.87);
      }
    }
  }
  @media screen and (max-width: 768px){
    .form{
      width: 100%;
    }
  }
`;
