import React, { Component } from 'react'
import ReactPlayer from 'react-player';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Testing extends Component {
    constructor() {
        super();
        this.state = {
            file: '',
            isFile: false,
            ed: [],
            isTesting: false,
            fileTestingName: '',
            dSort: [],
            labelPrediksi: [[], []],
            accuracy: [[], []],
            kSort: [],
            isMethod: 0,
            kInput: 0,
            yTrue: [],
            resultNb: [],
            score: "0"
        }
    }

    componentDidMount() {
        const temp = localStorage.getItem("video_testing");
        if (temp !== null) {
            this.setState({ isFile: true });
        }
    }

    onChange = e => {
        const file = e.target.files[0];
        this.setState({ file: file })
    }


    onSubmit = async e => {
        e.preventDefault();
        window.localStorage.removeItem("video_testing");
        let file = this.state.file;
        const formData = new FormData();
        if (file) {
            formData.append("file", file);
            return axios.post("admin/upload/testing", formData).then(resp => {
                if (resp.data.stats === 0) {
                    localStorage.setItem("video_testing", resp.data.dir)
                    this.setState({ isFile: true });
                }
                else {
                    alert("Video Bersangkutan Telah Diupload")
                }
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            alert("Tidak ada file yang diupload")
            this.setState({ isFile: false });
            window.location.reload(true)
        }
    }

    onTesting = async e => {
        if (this.state.isMethod !== 0) {
            const file = localStorage.getItem("video_testing");
            if (this.state.isMethod === 1) {
                const k = parseInt(this.state.kInput);
                if (k % 2 === 1 && k >= 0) {
                    return axios.post("admin/knn_metode", {
                        file: file,
                        k: k
                    }, {
                        headers: { "Content-type": "application/json" }
                    }).then(resp => {
                        alert(resp.data.alert)
                        this.setState({ fileTestingName: resp.data.file })
                        this.setState({ isTesting: true })
                        this.setState({ ed: Object.values(resp.data.ed) })
                        this.setState({ dSort: Object.values(resp.data.dSort) })
                        this.setState({ labelPrediksi: resp.data.label })
                        this.setState({ accuracy: resp.data.accuracy })
                        this.setState({ kSort: Object.values(resp.data.kSort) })
                        this.setState({ kInput: resp.data.kInput })
                        this.setState({ yTrue: Object.values(resp.data.yTrue) })
                        this.setState({ score: resp.data.scorePre })
                    }).catch(err => {
                        console.log(err);
                    })
                }
                else {
                    alert("Data Input K harus Ganjil")
                }
            }
            else {
                return axios.post("admin/naiveBayes_metode", {
                    file: file
                }, {
                    headers: { "Content-type": "application/json" }
                }).then(resp => {
                    alert("Data Prediksi Berhasil")
                    this.setState({ resultNb: resp.data.result })
                    this.setState({ isTesting: true })
                    this.setState({ fileTestingName: resp.data.file })
                    this.setState({ score: resp.data.scorePre })
                })
            }
        }
        else {
            alert("Harus Memilih Metode")
        }
    }

    kInputChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        this.setState({ kInput: value })
    }

    methodeChange = (e) => {
        e.preventDefault();
        const target = parseInt(e.target.value);
        this.setState({ isMethod: target })
        this.setState({ isTesting: false })
    }

    onViewKnn() {
        return (
            <div>
                <h1 style={{ marginTop: "20px", textAlign: "left" }}>Output Euqlidiance Distance</h1>
                <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "19px" }}>Video Testing : {this.state.fileTestingName}</h1>
                <b><h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "19px" }}>Score Model Fit : {this.state.score}</h1></b>


                <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "16px" }}><b>Distance Sebelum Sort</b></h1>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "5%" }}>
                                No
                            </th>
                            <th style={{ width: "17%" }}>
                                Nama Video Training
                            </th>
                            <th style={{ width: "17%" }}>
                                Label Video Training
                            </th>
                            <th style={{ width: "20%" }}>
                                Euqlidiance Distance
                            </th>
                            <th style={{ width: "20%" }}>
                                Manhatance Distance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.ed.map((res, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{res.nama}</td>
                                    <td>{res.label}</td>
                                    <td>{res.ed}</td>
                                    <td>{res.md}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "16px" }}><b>Distance Sesudah Sort</b></h1>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "5%" }}>
                                No
                            </th>
                            <th style={{ width: "13%" }}>
                                Nama Video
                            </th>
                            <th style={{ width: "13%" }}>
                                Label Video
                            </th>
                            <th style={{ width: "17%" }}>
                                Euqlidiance Distance
                            </th>
                            <th style={{ width: "2%", border: "none" }}></th>
                            <th style={{ width: "5%" }}>
                                No
                            </th>
                            <th style={{ width: "13%" }}>
                                Nama Video
                            </th>
                            <th style={{ width: "13%" }}>
                                Label Video
                            </th>
                            <th style={{ width: "20%" }}>
                                Manhatance Distance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.dSort.map((res, i) => {
                            return (
                                <tr key={i} >
                                    <td>{i + 1}</td>
                                    <td>{res[0][0]}</td>
                                    <td>{res[0][3]}</td>
                                    <td>{res[0][1]}</td>
                                    <td style={{ width: "2%", border: "none" }}></td>
                                    <td>{i + 1}</td>
                                    <td>{res[1][0]}</td>
                                    <td>{res[1][3]}</td>
                                    <td>{res[1][2]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "16px" }}><b>Pemilihan KNN dengan K : {this.state.kInput}</b></h1>
                <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "16px" }}><b>Prediksi Ed Seharusnya : </b></h1>
                {this.state.yTrue.length > 0 && this.state.yTrue[0].map((res, i) => {
                    return (
                        <>{i + 1}.{res} {' '}</>
                    )
                })}
                <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "16px" }}><b>Prediksi Manhattan Seharusnya : </b></h1>
                {this.state.yTrue.length > 0 && this.state.yTrue[1].map((res, i) => {
                    return (
                        <>{i + 1}.{res} {' '}</>
                    )
                })}
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "5%" }}>
                                No
                            </th>
                            <th style={{ width: "13%" }}>
                                Nama Video
                            </th>
                            <th style={{ width: "13%" }}>
                                Label Video
                            </th>
                            <th style={{ width: "17%" }}>
                                Euqlidiance Distance
                            </th>
                            <th style={{ width: "2%", border: "none" }}></th>
                            <th style={{ width: "5%" }}>
                                No
                            </th>
                            <th style={{ width: "13%" }}>
                                Nama Video
                            </th>
                            <th style={{ width: "13%" }}>
                                Label Video
                            </th>
                            <th style={{ width: "20%" }}>
                                Manhatance Distance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.kSort.map((res, i) => {
                            return (
                                <tr key={i} >
                                    <td>{i + 1}</td>
                                    <td>{res[0][0]}</td>
                                    <td>{res[0][3]}</td>
                                    <td>{res[0][1]}</td>
                                    <td style={{ width: "2%", border: "none" }}></td>
                                    <td>{i + 1}</td>
                                    <td>{res[1][0]}</td>
                                    <td>{res[1][3]}</td>
                                    <td>{res[1][2]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tbody>
                        <tr>
                            <td colSpan="3"><b>Prediksi : {this.state.labelPrediksi[0]}</b></td>
                            <td><b>Accuracy : {this.state.accuracy[0]} %</b></td>
                            <td style={{ width: "2%", border: "none" }}></td>
                            <td colSpan="3"><b>Prediksi : {this.state.labelPrediksi[1]}</b></td>
                            <td><b>Accuracy : {this.state.accuracy[1]} %</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    onViewNb() {
        if (this.state.isMethod === 2 && this.state.isTesting === true) {
            return (
                <div>
                    <h1 style={{ marginTop: "20px", textAlign: "left" }}>Output Naive Bayes</h1>
                    <h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "19px" }}>Video Testing : {this.state.fileTestingName}</h1>
                    <b><h1 style={{ marginTop: "20px", textAlign: "left", fontSize: "19px" }}>Score Model Fit : {this.state.score}</h1></b>
                    <table border="1">
                        <thead>
                            <tr>
                                <th style={{ width: "45%" }}>
                                    <center>
                                        Video Lele
                                </center>
                                </th>
                                <th>
                                    <center>
                                        Output Data Training
                                </center>
                                </th>
                            </tr>
                        </thead>
                        {this.state.resultNb.length !== 0 && Object.values(this.state.resultNb).map((res, i) => {
                            return (
                                <>
                                    <tbody key={i}>
                                        <tr>
                                            <td>{res.nama}</td>
                                            <td>{res.result}</td>
                                        </tr>
                                    </tbody>
                                </>
                            )
                        })}
                    </table>
                </div>

            )
        }
    }
    render() {
        try {
            var videoPlay;
            if (this.state.isFile === true) {
                videoPlay = require('../video/testing/' + localStorage.getItem("video_testing")).default;
            }
            else {
                videoPlay = "";
            }
        } catch (error) {
        }
        return (
            <div className="wrapper">
                <div className="main_container">
                    <div className="item" style={{ marginLeft: "10px" }}>
                        <div className="nav_atas">
                            <ul>
                                <li>
                                    <Link to="/testing" className="active_nav_atas">Form Testing</Link>
                                </li>
                                <li>
                                    <Link to="/cross_validation">
                                        K Cross Validation
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="form">
                            <h1 style={{ textAlign: "left", marginBottom: "30px", marginTop: "20px" }}>
                                Form Testing Klasifikasi Bibit Lele
                            </h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th > Upload File Video :
                                            <br />
                                            <input type="file" style={{ marginTop: "10px", width: "84%" }} id="fileUpload" accept="video/*" onChange={this.onChange} />
                                            <button onClick={this.onSubmit} type='submit' style={{ marginLeft: "10px", width: "15%" }} className="btn_tolak">Upload Video</button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ height: "600px" }}>
                                            {this.state.isFile === true ? (
                                                <ReactPlayer
                                                    controls={true} url={videoPlay} width={'100%'} height={600} />
                                            ) :
                                                (<h1><b>Harap Upload Video</b></h1>)}
                                        </td>
                                    </tr>
                                </tbody>
                                {this.state.isFile === true && (
                                    <tbody>
                                        <tr>
                                            <td>
                                                <button type="submit" onClick={this.onTesting} style={{ width: "15%", float: "right" }} className="btn-klasifikasi">Proses Testing</button>
                                                {this.state.isMethod === 1 && (
                                                    <input style={{ float: "right", marginRight: "20px" }} onChange={(e) => this.kInputChange(e)} name="kInput" value={this.state.kInput} placeholder="Input K"></input>
                                                )}
                                                <select defaultValue="0" onChange={(e) => this.methodeChange(e)} className="btn_tolak" name="metode" style={{ marginRight: "20px", float: "right", width: "15%", background: "rgba(0, 136, 169, 0.8)" }}>
                                                    <option value="0" disabled={true}>Pilih Metode Klasifikasi</option>
                                                    <option value="1">KNN</option>
                                                    <option value="2">Naive Bayes</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                            {this.state.isTesting === true && this.state.isMethod === 1 ? this.onViewKnn() : this.onViewNb()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Testing
