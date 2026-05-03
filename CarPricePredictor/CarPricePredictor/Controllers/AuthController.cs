using CarPricePredictor.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarPricePredictor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;

        public AuthController(TokenService tokenService)
        {
            this._tokenService = tokenService;
        }

        [HttpGet("handshake")]
        public ActionResult GetToken()
        {
            var token = _tokenService.GenerateToken();
            return Ok(new { tempToken = token });
        }
    }
}
