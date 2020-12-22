import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/admin.css';
import axios from 'axios';
import ReactPlayer from 'react-player'

class Training extends Component {
    constructor() {
        super();
        this.state = {
            file: '',
            isFile: false,
            data: []
        }
    }

    componentDidMount() {
        const temp = localStorage.getItem("video_training");
        if (temp !== null) {
            this.setState({ isFile: true });
        }
    }

    onChange = e => {
        const file = e.target.files[0];
        this.setState({ file: file })
    }

    onKlasifikasi = async e => {
        e.preventDefault();
        const file = localStorage.getItem("video_training");
        return axios.post("admin/data/training", {
            file: file,
        }, {
            headers: { "Content-type": "application/json" }
        }).then(resp => {
            this.setState({ data: resp.data.data })
            alert(resp.data.alert)
        }).catch(err => {
            console.log(err);
        })
    }

    onSubmit = async e => {
        this.setState({ data: [] })
        e.preventDefault();
        window.localStorage.removeItem("video_training");
        let file = this.state.file;
        const formData = new FormData();
        if (file) {
            formData.append("file", file);
            return axios.post("admin/upload/training", formData).then(resp => {
                if (resp.data.stats === 0) {
                    localStorage.setItem("video_training", resp.data.dir)
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
        }
    }

    render() {
        try {
            var videoPlay;
            if (this.state.isFile === true) {
                videoPlay = require('../video/training/' + localStorage.getItem("video_training")).default;
            }
            else {
                videoPlay = "";
            }
        } catch (error) {
        }
        return (
            <div className="wrapper">
                <div className="main_container">
                    <div className="item">
                        <div className="nav_atas">
                            <ul>
                                <li>
                                    <Link to="/training" className="active_nav_atas">Form Upload Video</Link>
                                </li>
                                <li>
                                    <Link to="/show_train">
                                        Show Data Training Video
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="form">
                            <Fragment>
                                <table border="1">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "45%" }} > Upload File Video :
                                            <br />
                                                <input type="file" style={{ marginTop: "10px" }} id="fileUpload" accept="video/*" onChange={this.onChange} />
                                                <button onClick={this.onSubmit} type='submit' style={{ marginLeft: "10px" }} className="btn_tolak">Upload Video</button>
                                            </th>
                                            <th>
                                                <center>
                                                    Output Proses POC
                                                </center>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ height: "400px" }}>
                                                {this.state.isFile === true ? (
                                                    < ReactPlayer
                                                        controls={true} url={videoPlay} width={600} height={400} />
                                                ) :
                                                    (<h1><b>Harap Upload Video</b></h1>)}
                                            </td>
                                            <td>
                                                {this.state.data.length === 0 ? (
                                                    <h1>Harap Melakukan Proses POC</h1>
                                                ) :
                                                    <table style={{ marginTop: "-12.5px" }} className="tb-view">
                                                        <thead>
                                                            <tr>
                                                                <th>Variable</th>
                                                                <th>Output Variable</th>
                                                            </tr>
                                                        </thead>
                                                        {Object.values(this.state.data).map((res, idx) => {
                                                            return (
                                                                <tbody key={idx}>
                                                                    <tr>
                                                                        <td>{res.nama}</td>
                                                                        <td>{res.result}</td>
                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })}
                                                    </table>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                    {this.state.isFile === true && (
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <button type="submit" onClick={this.onKlasifikasi} style={{ float: "right" }} className="btn-klasifikasi">Proses Klasifikasi Training</button>
                                                </td>
                                                <td>

                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </Fragment>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

export default Training
