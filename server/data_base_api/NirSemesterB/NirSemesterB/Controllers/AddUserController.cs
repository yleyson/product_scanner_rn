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
    public class AddUserController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Post([FromBody] Register User)
        {
            try
            {
                Register student2Return = BLLUsers.Register(User);
                if (student2Return == null)
                {
                    return Content(HttpStatusCode.NotFound, $"wrong details! "/* + student2Return.ToString()*/);
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
