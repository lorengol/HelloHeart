import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import stringSimilarity from "string-similarity";
import { Button, TextField } from '@mui/material';
import './App.css';

const LIMIT_RATE = '0.18';

const App = () => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onBlur"
  });
  const [testName, settestName] = useState('');
  const [testResult, setTestResult] = useState('');
  const [allTests, setAllTests] = useState([]);
  const [allTestNames, setAllTestNames] = useState([]);

  useEffect(() => {
    axios
      .get('/all-tests')
      .then(res => {
        setAllTests(res.data);
        setAllTestNames(res.data.map(test => {
          return test.name.toUpperCase();
        }));
      });
  }, []);

  const findSameRate = (bestRating, ratings) =>
    ratings.filter((item) =>
      item.rating === bestRating
    )

  const onSubmit = (data) => {
    let matches = stringSimilarity.findBestMatch(
      data.testName.toUpperCase(),
      allTestNames
    );

    if (matches.bestMatch.rating >= LIMIT_RATE &&
        findSameRate(matches.bestMatch.rating, matches.ratings).length === 1) {
      let matchedTest = allTests[matches.bestMatchIndex];
      settestName(matchedTest.name);
      data.testValue <= matchedTest.threshold ?
        setTestResult('Good!') : setTestResult('Bad!');
    } else {
      settestName('Unknown');
      setTestResult('');
    }
  };

  return (
    <div className="App">
      <h1>Blood test clinic</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="Test">
          <div style={{ paddingRight: '30px' }}>
            <TextField
              label="Test Name"
              {...register("testName", {
                required: true,
                pattern: /^[0-9A-Za-z\\s(),-:/! ]*$/,
                maxLength: 25
              })}
            />
            {errors.testName?.type === 'required' && <p>Test name is required</p>}
            {errors.testName?.type === 'pattern' && <p>Test name is not valid</p>}
            {errors.testName?.type === 'maxLength' && <p>Test name is too long</p>}
          </div>
          <div>
            <TextField
              type="number"
              label="Test Value"
              {...register("testValue", { required: true })}
            />
            {errors.testValue && <p>Test value is required</p>}
          </div>
        </div>
        <Button type="submit" variant="contained">Check result</Button>
        <h3 style={{ paddingTop: '50px' }}>{`${testName} ${testResult}`}</h3>
      </form>
    </div>
  );
}

export default App;
