using BLLings;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NirSemesterB.Controllers
{
    public class GetIngsForProductController : ApiController
    {
        [HttpGet]
        [Route("api/GetIngredientsInfo/{id}")]
        public IHttpActionResult GET(int id)
        {
            try
            {
                DataTable Table = BLLUsers.ListOfIngs(id);
                if (Table == null)
                {
                    return Content(HttpStatusCode.NotFound, $"No ingredintes found with id={id} was not found in DB! "/* + student2Return.ToString()*/);
                }

                return Ok(Table);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpGet]
        [Route("api/GetIngDesc/{name}")]
        public IHttpActionResult GET(string name)
        {
            try
            {
                string desc = BLLUsers.GetIngDesc(name);
                if (desc == null)
                {
                    return Content(HttpStatusCode.NotFound, $"not found");
                }

                return Ok(desc);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



    }
}
