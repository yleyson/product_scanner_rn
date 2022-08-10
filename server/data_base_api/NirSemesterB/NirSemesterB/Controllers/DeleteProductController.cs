using DALings;
using BLLings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NirSemesterB.Controllers
{
    public class DeleteProductController : ApiController
    {
        [HttpDelete]
        public IHttpActionResult Delete(int product)
        {
            try
            {
                int p = BLLUsers.Delete(product);
                if (p == 0)
                {
                    return Content(HttpStatusCode.NotFound, $"wrong details! "/* + student2Return.ToString()*/);
                }

                return Ok(p);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
