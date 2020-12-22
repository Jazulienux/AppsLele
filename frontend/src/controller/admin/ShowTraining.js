import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/admin.css';
import axios from 'axios';
import ReactPlayer from 'react-player'

class ShowTraining extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        return axios.get(
            "admin/get_train", {
            headers: { "Content-type": "application/json" }
        }).then(res => {
            this.setState({ data: res.data.data })
        })
    }

    onDelete = (id, nama) => {
        return axios.post(
            "admin/delete_train", {
            id: id,
            nama: nama
        }, {
            headers: { "Content-type": "application/json" }
        }).then(res => {
            alert(res.data.result)
            window.location.reload(true);
        })
    }

    render() {
        return (
            <div className="wrapper">
                <div className="main_container">
                    <div className="item">
                        <div className="nav_atas">
                            <ul>
                                <li>
                                    <Link to="/training">Form Upload Video</Link>
                                </li>
                                <li>
                                    <Link to="/show_train" className="active_nav_atas">
                                        Show Data Training Video
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="form">
                            <table>
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
                                {this.state.data.length !== 0 && Object.values(this.state.data).map((res, i) => {
                                    var videoPlay = require('../video/training/' + res.nama).default;
                                    let temp = [
                                        ["Nama Video", res.nama],
                                        ["Rerata POC", res.rerata],
                                        ["Box Total POC", res.box],
                                        ["Total 0 Frame POC", res.nilai_nol],
                                        ["Label Video", res.label],
                                    ]
                                    return (
                                        <tbody key={i}>
                                            <tr>
                                                <td>
                                                    < ReactPlayer
                                                        controls={true} url={videoPlay} width={600} height={400} />
                                                </td>
                                                <td>
                                                    <table className="tb-view">
                                                        <thead>
                                                            <tr>
                                                                <th>Variable</th>
                                                                <th>Output Variable</th>
                                                            </tr>
                                                        </thead>
                                                        {temp.map((data_result, idx) => {
                                                            return (
                                                                <tbody key={idx}>
                                                                    <tr>
                                                                        <td>{data_result[0]}</td>
                                                                        <td>{data_result[1]}</td>
                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })}
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan="2">
                                                                    <button onClick={(e) => window.confirm("Apa Anda Yakin Menghapus Data Ini ? ") && this.onDelete(res.id, res.nama)} className="btn_delete_data" style={{ padding: "8px 8px", width: "30%", float: "right" }}>Delete Data</button>

                                                                    <Link to={{
                                                                        pathname: "/update_train", state: {
                                                                            id: res.id
                                                                        }
                                                                    }}>
                                                                        <button style={{ padding: "8px 8px", width: "30%", float: "right", marginRight: "15px" }} className="btn_tolak">Update</button>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowTraining;