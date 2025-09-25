import { useContext } from "react"
import { UsuarioContext } from "./context/UsuarioContext"

export const HomeScreen = () => {

  const {usuario} = useContext( UsuarioContext )

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Tecnologia</th>
            <th scope="col">Email</th>
            <th scope="col">Redes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{usuario.nombre}</th>
            <td scope="row">{usuario.tecnologia}</td>
            <td scope="row">{usuario.email}</td>
            <td scope="row">{usuario.redes}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

