<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>rh-icon demo</title>

		<link rel="stylesheet" href="../src/css/rh-icon.css" />
		<link rel="stylesheet" href="../demo/css/app.css" />
	</head>
	<body>
		<div class="visuallyhidden"><?php print(file_get_contents(dirname(__FILE__) . '/svg/icon.svg')); ?></div>

		<table>
			<tr>
				<td>
					<a><span rh-icon
							 data-id="0008-quill"
							 data-title="Quill"
							 data-color="black"
							 data-hover-color="blue"></span></a>
				</td>
				<td>
					Black quill turns blue on hover
				</td>
			</tr>
			<tr>
				<td>
					<a><span rh-icon
							 data-id="0016-camera"
							 data-title="Camera"
							 data-color="blue"
							 data-hover-color="black"></span></a>
				</td>
				<td>
					Blue camera turns black on hover (2x)
				</td>
			</tr>
			<tr>
				<td>
					<a><span rh-icon
							 data-id="0016-camera"
							 data-hover-id="0014-image"
							 data-title="Image"
							 data-color="blue"
							 data-hover-color="black"></span></a>
				</td>
				<td>
					Blue camera turns to black picture on hover (3x)
				</td>
			</tr>
			<tr>
				<td>
					<a><span rh-icon
							 data-id="0027-bullhorn-512x128"
							 data-width="512"
							 data-height="128"
							 data-title="Bullhorn"
							 data-color="black"
							 data-hover-color="blue"></span></a>
				</td>
				<td>
					Black bullhorn icon turns blue on hover (4:1)
				</td>
			</tr>
		</table>

		<script src="../bower_components/lodash/lodash.js"></script>
		<script src="../bower_components/jquery/dist/jquery.js"></script>
		<script src="../bower_components/rhea/dist/js/rhea.js"></script>

		<script src="../src/js/rh-icon.js"></script>

		<script src="../demo/js/app.js"></script>
	</body>
</html>
