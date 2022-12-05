/***RECORDAR INSTALAR LO SIGUIENTE 
 * 
 * npm i express
 * npm i mongoose
 * npm i body-parse
 * npm fund
 * 
 */
const express = require('express')
//Para recibir los datos y no los manipule por le URL cuando los mande 
const bodyParser = require('body-parser')
//Modulo de mongo con node js que conecta el back con la bd 
const mongoose = require('mongoose')
const { response, json } = require('express')
const { serializeInteger } = require('whatwg-url')
const { Double } = require('bson')

var app = express()
const puerto = 3000

//uso para otras funciones post put 

/**PAra leer y recibir  */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//cadena para usuario sin clave
mongoose.connect('mongodb://localhost:27017/cuponex',{useNewUrlParser:true,useUnifiedTopology:true})
//Si llegaramos a tener un servidor ponemos en vez de localhost la dirección de acceso / base de datos a aceder

//cadena de conexión Si tuvieramos un pasword tenemos que agregar lo siguiente
//mongoose.connect('mongodb://username:password@localhost:27017/cimat',{userNewUrlParser:true,useUnifiedTopology:true})


//Conexión directa 

const conexion = mongoose.connection
var ip = require('ip');
conexion.once('open',()=>{
  //  console.log('conexion satisfactoria, puede trabajar')
   //console.log('*** Consulta http://localhost:3000/ + ruta de servicio')
   // console.log(ip.address())
//  console.log('*** Consulta http://'+ip.address()+':3000/ + ruta de servicio')
   console.log('*** Consulta http://'+ip.address()+':3000/consultarCupones')
   console.log('*** Consulta http://'+ip.address()+':3000/emailname/63853dfa79ac5970a64046ba')
/**
 ip.address() // my ip address
ip.isEqual('::1', '::0:1'); // true
ip.toBuffer('127.0.0.1') // Buffer([127, 0, 0, 1])
ip.toString(new Buffer([127, 0, 0, 1])) // 127.0.0.1
ip.fromPrefixLen(24) // 255.255.255.0
ip.mask('192.168.1.134', '255.255.255.0') // 192.168.1.0
ip.cidr('192.168.1.134/26') // 192.168.1.128
ip.not('255.255.255.0') // 0.0.0.255
ip.or('192.168.1.134', '0.0.0.255') // 192.168.1.255
ip.isPrivate('127.0.0.1') // true
ip.isV4Format('127.0.0.1'); // true
ip.isV6Format('::ffff:127.0.0.1'); // true

// operate on buffers in-place
var buf = new Buffer(128);
var offset = 64;
ip.toBuffer('127.0.0.1', buf, offset);  // [127, 0, 0, 1] at offset 64
ip.toString(buf, offset, 4);            // '127.0.0.1'

// subnet information
ip.subnet('192.168.1.134', '255.255.255.192')
// { networkAddress: '192.168.1.128',
//   firstAddress: '192.168.1.129',
//   lastAddress: '192.168.1.190',
//   broadcastAddress: '192.168.1.191',
//   subnetMask: '255.255.255.192',
//   subnetMaskLength: 26,
//   numHosts: 62,
//   length: 64,
//   contains: function(addr){...} }
ip.cidrSubnet('192.168.1.134/26')
// Same as previous.

// range checking
ip.cidrSubnet('192.168.1.134/26').contains('192.168.1.190') // true


// ipv4 long conversion
ip.toLong('127.0.0.1'); // 2130706433
ip.fromLong(2130706433); // '127.0.0.1'
 */
})


conexion.on('error',(err)=>{
    console.log('conexion fallida, verificar información')
})

/*
//Definir el modelo 
//Esto es el modelado de la base de datos 
const Datos = mongoose.model('datos',{nombre:String},'datos')
*/
//MODELOS 
/**Modelo de Cupones */
const DatosCupones = mongoose.model('Cupones',
{
    idCupon:Number,
    nombre:String,
    fechaInicio:Date,
    fechaFin:Date,
    descuento:Number,
    procentaje:Number,
    descripcion:String,
    idEmpresa: String,
    cantidad:Number
},'Cupones')
/**Modelo de Usuarios */
const DatosUsuarios = mongoose.model('Usuarios_Usuario',
{
    idUsuarios:Number,
    nombre:String,
    apellidos:String,
    direccion:String,
    telefono:String,
    correo:String,
    contrasenia:String,
    tipoUsr:Boolean
},'Usuarios_Usuario')
/**Modelo de Empresas */
const DatosEmpresa = mongoose.model('Usuario_Empresas',
{
  
    nombre:String,
    direccion:String,
    telefono:String,
    correo:String,
    contrasenia:String,
    idCategoria:Number,
    tipoUsr:Boolean
},'Usuario_Empresas')
/**Modelo de Cupones Consumidos */
const DatosCupCon = mongoose.model('CuponesConsumidos',
{
    idCupon:String,
    idUsuario:String,
    fechaConsumo:Date,
},'CuponesConsumidos')
/**Modelo de Categoria_Empresa */
const DatosCatEmp = mongoose.model('categoria_Empresa',
{
    idCategoria:Number,
    nombreCategoria:String
},'categoria_Empresa')
//
app.get('/',(req,res)=>{
    res.json({response:'exito'})
})
//CONSULTAR DETALLE CUPON 1 
app.get('/conDetCupOne/:id',(req,res)=>{
    const id= req.params.id
    DatosCupones.find({_id: id})
    .then(doc=>{
        res.json({response:'satisfactorio',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})
// CONSULTAR DATOS ****************************************************************************************
//***Consulta Categorias  */
app.get('/consultarCate', async (req,res)=>{
    DatosCatEmp.find()
    .then(doc=>{
       res.json({response:'satisfactorio',data:doc})
        //res.json(doc)
        //res.array(data);
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})
//Consultar Cupones CONSUMIDOS asociados al usuario
app.get('/detCupUser/:id',(req,res)=>{
    const id= req.params.id;
    DatosCupCon.find({idUsuario: id})
    .then(doc=>{
        res.json({response:'satisfactorio',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})
/**CUPONES CONSULTA */
//Metodo con promesas -> no define un tiempo fijo en completar todo y así ayuda en aspecto hay mala conexion 
app.get('/consultarCupones', async (req,res)=>{
    DatosCupones.find()
    .then(doc=>{
       res.json({response:'satisfactorio',data:doc})
        //res.json(doc)
        //res.array(data);
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})

/**USUARIOS CONSULTA */
app.get('/consultarUsuarios',(req,res)=>{
    DatosUsuarios.find()
    .then(doc=>{
        res.json({response:'Consulta de Usuarios satisfactoria \n',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})

/**CuponesConsumidos Consulta */
/**Cnsulta la información completa de los cupones consumidos */
app.get('/consultarCupCon',(req,res)=>{
    DatosCupCon.find()
    .then(doc=>{
        res.json({response: 'Consulta de cupones consumidos satisfactoria \n', data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    }) 
})
/**CONSULTA EMPRESAS */
app.get('/consultarEmpresas',(req,res)=>{
    DatosEmpresa.find()
    .then(doc=>{
        res.json({response:'Consulta de Usuarios satisfactoria \n',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})
/**CONSULTA EMPRESAS BY CATEGORY */
app.get('/consEmpreByCat/:id',(req,res)=>{
    const id= req.params.id
    DatosEmpresa.find(
        {idCategoria:id},
    )
    .then(doc=>{
        res.json({response:'Correcto \n',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})

/**CONSULTA EMPRESAS BY CATEGORY */
app.get('/cupByIdCatBuss/:id',(req,res)=>{
    const id= req.params.id
    DatosCupones.find(
        {idEmpresa:id},
    )
    .then(doc=>{
        res.json({response:'Correcto \n',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})
/*************** */
app.listen(puerto, ()=>{
    console.log('Servidor corriendo')
})
//consultar un dato en especifico 
//Metodo con promesos -> no define un tiempo fijo en completar todo y así ayuda en aspecto hay mala conexion 
app.get('/consultarUno',(req,res)=>{
    Datos.find({nombre:"Anahi"})
    .then(doc=>{
        res.json({response:'satisfactorio',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})
//CONSULTA LOGIN *****************************************************************************************
app.get('/login/:correo/:contrasenia',(req,res)=>{
    const correo= req.params.correo
    const contrasenia= req.params.contrasenia   
     DatosUsuarios.find({
        correo: correo,
        contrasenia: contrasenia
     })
    .then(doc=>{
        //console.log('consulta echa',doc)
        res.json({//response:'satisfactorio',
        data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})

//CONSULTA email *****************************************************************************************
app.get('/emailname/:id',(req,res)=>{
    const id= req.params.id
    DatosUsuarios.find({_id: id})
    .then(doc=>{
        res.json({response:'satisfactorio',data:doc})
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})


/*
app.post('/insertarEmpresa',(req,res)=>{
    const valor=new DatosEmpresa({
       // idEmpresa:req.body.idEmpresa,
        nombre:req.body.nombre,
        direccion:req.body.direccion,
        telefono:req.body.telefono,
        correo:req.body.correo,
        contrasenia:req.body.contrasenia,
        idCategoria:req.body.idCategoria,
        tipoUsr:req.body.tipoUsr
    })
    valor.save()
    .then(doc=>{ //promesa para verificar que se realice
        console.log('Empresa Registrada',doc)
        res.json({response:'success'})
    })
    .catch(err=>{
        console.log("Error al Registrar Empresa", err.message)
    })
})

 */
//POST - Insertar
/**INSERTAR EMPRESA */
app.post('/insertarEmpresa',(req,res)=>{
    const valor=new DatosEmpresa({
       // idEmpresa:req.body.idEmpresa,
        nombre:req.body.nombre,
        direccion:req.body.direccion,
        telefono:req.body.telefono,
        correo:req.body.correo,
        contrasenia:req.body.contrasenia,
        idCategoria:req.body.idCategoria,
        tipoUsr:req.body.tipoUsr
    })
    valor.save()
    .then(doc=>{ //promesa para verificar que se realice
        console.log('Empresa Registrada',doc)
        res.json({response:'success'})
    })
    .catch(err=>{
        console.log("Error al Registrar Empresa", err.message)
    })
})
/**INSERTAR Cupones Consumidos */
app.post('/insertarCupoConsu',(req,res)=>{
    const valor=new DatosCupCon({
        idCupon:req.body.idCupon,
        idUsuario:req.body.idUsuario,
        fechaConsumo:req.body.fechaConsumo
    })
    valor.save()
    .then(doc=>{ //promesa para verificar que se realice
        console.log('Registro de cupon consumido almacenado',doc)
        res.json({response:'success'})
    })
    .catch(err=>{
        console.log("Error al Registrar Consumo de cupon", err.message)
    })
})
/**INSERTAR USUARIOS */
app.post('/insertarUsuario',(req,res)=>{
    const valor=new DatosUsuarios({
       // idUsuarios:req.body.idUsuarios,
        nombre:req.body.nombre,
        apellidos:req.body.apellidos,
        direccion:req.body.direccion,
        telefono:req.body.telefono,
        correo:req.body.correo,
        contrasenia:req.body.contrasenia,
        tipoUsr:req.body.tipoUsr
    })
    valor.save()
    .then(doc=>{ //promesa para verificar que se realice
        console.log('Usuario Registrado',doc)
        res.json({response:'success'})
    })
    .catch(err=>{
        console.log("Error al Registrar Usuario", err.message)
    })
})
/**INSERTAR CUPONES */
app.post('/insertarCupon',(req,res)=>{
    const valor=new DatosCupones({
        idCupon:req.body.idCupon,
        nombre:req.body.nombre,
        fechaInicio:req.body.fechaInicio,
        fechaFin:req.body.fechaFin,
        descuento:req.body.descuento,
        procentaje:req.body.procentaje,
        descripcion:req.body.descripcion,
        idEmpresa:req.body.idEmpresa,
        cantidad:req.body.cantidad,
    })
    valor.save()
    .then(doc=>{ //promesa para verificar que se realice
        console.log('Cupón Registrado',doc)
        res.json({response:'success'})
    })
    .catch(err=>{
        console.log("Error al Registrar Cupón", err.message)
    })
})
// PUT - Actualizar ****************************************************************************
/**ACTUALIZAR  Cupones Consumidos */
app.get('/actualizarCupConsu/:id',(req,res)=>{
    const id= req.params.id
    DatosCupCon.findByIdAndUpdate(
        {_id:id},
        {$set:{idCupon:idCupon}},
        {$set:{idUsuario:idUsuario}},
        {$set:{fechaConsumo:fechaConsumo}},
        )
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Actualización de datos Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al actualizar", err.message)
    })

})
/**ACTUALIZAR  EMPRESA */
app.get('/actualizarEmpresa/:id',(req,res)=>{
    const id= req.params.id
    DatosEmpresa.findByIdAndUpdate(
        {_id:id},
        {$set:{nombre:nombre}},
        {$set:{direccion:direccion}},
        {$set:{telefono:telefono}},
        {$set:{correo:correo}},
        {$set:{contrasenia:contrasenia}},
        {$set:{idCategoria:idCategoria}},
        )
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Actualización de datos Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al actualizar", err.message)
    })

})
/**ACTUALIZAR  USUARIO */
app.post('/actualizarUser/:id',(req,res)=>{
    const id= req.params.id
    DatosUsuarios.findByIdAndUpdate(
        id,
        {$set:{
            nombre:req.body.nombre,
            apellidos:req.body.apellidos,
            direccion:req.body.direccion,
            telefono:req.body.telefono,
            correo:req.body.correo,
            contrasenia:req.body.contrasenia
        }},
        {new: true}
        )
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Actualización de datos Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al actualizar", err.message)
    })

})
/**ACTUALIZAR  CUPONES */
app.get('/actualizarCup/:id',(req,res)=>{
    const id= req.params.id
    DatosCupones.findByIdAndUpdate(
        {_id:id},
        {$set:{idCupon:idCupon}},
        {$set:{nombre:nombre}},
        {$set:{fechaInicio:fechaInicio}},
        {$set:{fechaFin:fechaFin}},
        {$set:{descuento:descuento}},
        {$set:{procentaje:procentaje}},
        {$set:{descripcion:descripcion}},
        {$set:{idEmpresa:idEmpresa}},
        {$set:{cantidad:cantidad}},
        )
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Actualización de datos Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al actualizar", err.message)
    })

})
/**ACTUALIZAR  CUPONES */
app.get('/actualizarTotalCupones/:id',(req,res)=>{
    const id= req.params.id
    DatosCupones.findByIdAndUpdate(
        {_id:id},
        {$set:{idCupon:idCupon}},
        {$set:{cantidad:cantidad}},
        )
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Actualización de Cantidad Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al actualizar", err.message)
    })

})

app.get('/actualizar/:id',(req,res)=>{
    const id= req.params.id
    Datos.findByIdAndUpdate({_id:id},{$set:{nombre:"CAMBIADO"}})
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Actualización de datos Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al actualizar", err.message)
    })

})

// DELETE - ELIMINAR ********************************************************************************************

/**ELIMINAR CUPONES CONSUMIDOS */
app.get('/eliminarCupCon/:id',(req,res)=>{
    const id= req.params.id
    DatosCupCon.findByIdAndDelete({_id:id})
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Regitro Eliminado Correctamente',data:doc})
    })
    .catch(err=>{
        console.log("Error al Eliminar el Registro", err.message)
    })

})


/**ELIMINAR EMPRESA */
app.get('/eliminarEmpresaById/:id',(req,res)=>{
    const id= req.params.id
    DatosEmpresa.findByIdAndDelete({_id:id})
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Empresa Eliminada Correctamente',data:doc})
    })
    .catch(err=>{
        console.log("Error al Eliminar Empresa", err.message)
    })

})
/**ELIMINAR USUARIOS */
app.get('/eliminarEmpresaById/:id',(req,res)=>{
    const id= req.params.id
    DatosUsuarios.findByIdAndDelete({_id:id})
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Usuario Eliminado Correctamente',data:doc})
    })
    .catch(err=>{
        console.log("Error al Eliminar Usuario", err.message)
    })

})
/**ELIMINAR CUPONES */
app.get('/eliminarEmpresaById/:id',(req,res)=>{
    const id= req.params.id
    DatosCupones.findByIdAndDelete({_id:id})
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Cupon Eliminado Correctamente',data:doc})
    })
    .catch(err=>{
        console.log("Error al Eliminar Cupon", err.message)
    })

})

app.get('/eliminar/:id',(req,res)=>{
    const id= req.params.id
    Datos.findByIdAndDelete({_id:id})
    .then(doc=>{ //promesa para verificar que se realice
        res.json({response:'Eliminación Correcta',data:doc})
    })
    .catch(err=>{
        console.log("Error al eliminar", err.message)
    })

})
//CONSUMO DE CUPONES
app.get('/obtenerCupon/:id',(req,res)=>{
    /**
     *  DatosUsuarios.findByIdAndUpdate(
        id,
        {$set:{
            nombre:req.body.nombre,
            apellidos:req.body.apellidos,
            direccion:req.body.direccion,
            telefono:req.body.telefono,
            correo:req.body.correo,
            contrasenia:req.body.contrasenia
        }},
        {new: true}
        )
     */
    
    const id= req.params.id
    dat = [];
    operacion = 0;
    DatosCupones.findByIdAndUpdate(
        id,
        {$set:{
            nombre:req.body.nombre,
            apellidos:req.body.apellidos,
            direccion:req.body.direccion,
            telefono:req.body.telefono,
            correo:req.body.correo,
            contrasenia:req.body.contrasenia
        }},
        {new: true}
        )
    .then(doc=>{
        res.json({
            data:doc 
        })
        dat = doc
        operacion = dat[0].cantidad -1
        if(operacion>-1){
          //  console.log(operacion)
          //  console.log("Valor de operacion al momento de entrar a update "+operacion)
            DatosCupones.findByIdAndUpdate(
                {_id:id},
                {$set:{cantidad:operacion}},
                )
            .then(doc=>{ //promesa para verificar que se realice
                //res.json({response:'Actualización de Cantidad Correcta'})
                console.log("Consumo Correcto")
                return 1
            })
            .catch(err=>{
                console.log("Error al actualizar: ", err.message)
            })
        }else{
            console.log("Ya no hay nada")
            return 0
        }
    })
    .catch(err=>{
        console.log("Error : "+err)
    })
})