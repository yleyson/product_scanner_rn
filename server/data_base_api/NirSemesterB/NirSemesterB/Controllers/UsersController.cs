using DALings;
using BLLings;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;

namespace NirSemesterB.Controllers
{
    public class UsersController : ApiController
    {

        public IHttpActionResult GET(string pass,string user_mail)
        {
            try
            {
                Users student2Return =BLLUsers.FindUserById(pass,user_mail);
                if (student2Return == null)
                {
                    return Content(HttpStatusCode.NotFound, $"User with pass={pass} and mail={user_mail} was not found in DB! "/* + student2Return.ToString()*/);
                }

                return Ok(student2Return);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
