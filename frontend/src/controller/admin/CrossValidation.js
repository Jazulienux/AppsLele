import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

class CrossValidation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            videoFile: '',
            nInput: 0,
            isMethod: 0,
            kFlood: [],
            dataM: [],
            isOnclick: false
        }
    }

    componentDidMount() {
        this.setState({ videoFile: localStorage.getItem("video_testing") })
    }

    nSplitInputChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        this.setState({ nInput: value })
    }

    methodeChange = (e) => {
        e.preventDefault();
        const target = parseInt(e.target.value);
        this.setState({ isMethod: target })
    }

    onTesting = async e => {
        if (this.state.isMethod === 0) {
            alert("Harus Memilih Metode")
        }
        else {
            if (this.state.nInput <= 1) {
                alert("Data Input Minimal 2")
            }
            else {
                return axios.post("admin/cross_val", {
                    file: localStorage.getItem("video_testing"),
                    nInput: parseInt(this.state.nInput),
                    metode: parseInt(this.state.isMethod)
                }, {
                    headers: { "Content-type": "application/json" }
                }).then(res => {
                    this.setState({ nInput: res.data.nInput })
                    this.setState({ kFlood: Object.values(res.data.data) })
                    this.setState({ dataM: Object.values(res.data.dataM) })
                    this.setState({ videoFile: res.data.fileTest })
                    this.setState({ isOnclick: true })
                    alert("K Flood Cross Valudation Berhasil")
                })
            }
        }
    }

    onView() {
        let tempIdx = 0;
        return (
            <table style={{ border: "none", width: "100%" }} key={0}>
                <thead>
                    <tr>
                        <th>
                            <select defaultValue="0" onChange={(e) => this.methodeChange(e)} className="btn_tolak" name="metode" style={{ marginRight: "20px", float: "left", width: "15%", background: "rgba(0, 136, 169, 0.8)" }}>
                                <option value="0" disabled={true}>Pilih Metode Klasifikasi</option>
                                <option value="1">KNN</option>
                                <option value="2">Naive Bayes</option>
                            </select>
                            <input style={{ float: "left", marginRight: "20px" }} onChange={(e) => this.nSplitInputChange(e)} name="nSplit" value={this.state.nInput} placeholder="Input N Split"></input>
                            <button type="submit" onClick={this.onTesting} style={{ width: "15%", float: "left" }} className="btn-klasifikasi">Proses Testing</button>
                            <br />
                        </th>
                    </tr>
                </thead>
                {this.state.isOnclick === true && (
                    <table>
                        {this.state.kFlood.map((res, idx) => {
                            return (
                                res[0].map((t, i) => {
                                    if (i === 0) {
                                        tempIdx += 1;
                                        return (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "5%" }}>Nomor</th>
                                                        <th>Data Flood Training Flood Ke : {tempIdx}</th>
                                                        <th>Data Flood Testing Flood Ke : {tempIdx}</th>
                                                    </tr>
                                                </thead>
                                            </>
                                        )
                                    }
                                    return (
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "5%" }}>{i}</td>
                                                <td>{t}</td>
                                                {res[1][i] !== undefined ? (
                                                    <td>{res[1][i]}</td>
                                                ) : <td></td>}
                                            </tr>
                                        </tbody>
                                    )
                                })
                            )
                        })}
                    </table>
                )}
                {this.state.isOnclick === true && (
                    <h1 style={{ textAlign: "left", marginBottom: "30px", marginTop: "20px", fontSize: "20px" }}>
                        Video Testing : {this.state.videoFile}</h1>
                )}
                {this.state.isOnclick === true && (
                    <table>
                        <thead>
                            <tr>
                                <th>Prediksi Label Video Upload</th>
                                <th>Accuracy Video Testing Split - Training</th>
                            </tr>
                        </thead>
                        {this.state.dataM.map((res, idx) => {
                            return (
                                <tbody key={idx}>
                                    <tr>
                                        <td>{res[0]}</td>
                                        <td>{res[1]} %</td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                )}
            </table >
        )
    }

    render() {
        return (
            <div className="wrapper">
                <div className="main_container">
                    <div className="item" style={{ marginLeft: "10px" }}>
                        <div className="nav_atas">
                            <ul>
                                <li>
                                    <Link to="/testing">Form Testing</Link>
                                </li>
                                <li>
                                    <Link to="/cross_validation" className="active_nav_atas">
                                        K Cross Validation
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="form">
                            {this.state.videoFile === null ? (
                                <h1 style={{ textAlign: "left", marginBottom: "30px", marginTop: "20px" }}>
                                    Harap Uploda Video Testing pada Form Testing</h1>
                            ) : this.onView()
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CrossValidation