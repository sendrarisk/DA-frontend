import '../styles/ItemPage.css';
import NavBar from '../components/NavBar';
import Logo from '../components/Logo';
import LogoutButton from '../components/LogoutButton';
import PageTitleBar from '../components/PageTitleBar';
import { useState, useEffect } from 'react';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { useHistory } from 'react-router-dom';
import useLoggedUser from '../hooks/userLogged';
import '../styles/Table.css';
import pathnames from '../utils/pathnames';

function UserPage() {
    const [users, setUsers] = useState([]);
    let history = useHistory();
    let userLogged = useLoggedUser();

    useEffect(() => {
        if (userLogged) {
            UserService.getAll()
                .then(res => {
                    setUsers(res.data);
                })
                .catch(err => {
                    alert(err.response.data.message);
                    if (err.response.status === 403) history.push(pathnames.admin)
                })
        }
    }, [history, userLogged])

    if (!userLogged) return <div></div>

    return (
        <div className="itemPage">
            <NavBar
                leftItems={<Logo />}
                rightItems={<LogoutButton />}
            />
            <PageTitleBar route={pathnames.admin}>USUARIOS</PageTitleBar>
            <div className="itemPage__content">
                <button className="Table__Addbutton" onClick={() => history.push(pathnames.user_edit)}>AGREGAR USUARIO</button>
                <table className="Table">
                    <thead className="Table_thead">
                        <tr className="Table_tr">
                            <th className="Table_th">Nombre</th>
                            <th className="Table_th">Email</th>
                            <th className="Table_th">Rol</th>
                            <th className="Table_th"></th>
                        </tr>
                    </thead>
                    <tbody className="Table_tbody">
                        {users.map((e, index) =>
                            <Row
                                user={e}
                                key={index}
                            />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Row({ user }) {
    let history = useHistory();

    function deleteUser(id) {
        if (AuthService.getCurrentUser().id !== id) {
            UserService.remove(user.id)
                .then(res => history.go(0))
                .catch(err => alert("Error, no se puede eliminar este usuario"))
        } else {
            alert("No te puedes eliminar a ti mismo")
        }
    }

    return (
        <tr className="Table_tr">
            <td className="Table_td">{user.username}</td>
            <td className="Table_td">{user.email}</td>
            <td className="Table_td">{(user.isAdmin) ? 'Administrador' : 'Moderador'}</td>
            <td className="Table_td">
                <button
                    className="Table__button red_background"
                    onClick={() => deleteUser(user.id)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    )
}

export default UserPage;