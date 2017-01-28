<table>
	<thead>
		<tr>
			<th style="width: 200px;">URL</th>
			<th><?php echo $url?></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Request</td>
			<td><?php
			print_r($headers);
			?></td>
		</tr>
		<tr>
		<td>Status</td>
		<td><?php echo $response_code?></td>
		</tr>
		<tr>
			<td>Response</td>
			<td><?php
			
			if ($response) {
				echo "<code>" . nl2br ( htmlentities ( $response ) ) . "</code>";
			} 

			else {
				echo "No response";
			}
			?></td>
		</tr>
		<?php if (isset($error_code)):?>
		<tr>
			<td>Errors</td>
			<td>
				<table>
					<tr>
						<th>Code</th>
						<td>:</td>
						<td><?php echo $error_code?></td>
					</tr>
					<tr>
						<th>Message</th>
						<td>:</td>
						<td><?php echo $error_message?></td>
					</tr>
				</table>
			</td>
		</tr>
		<?php endif;?>
		<tr>
			<td>Call Details</td>
			<td style="padding-top: 10px;"><pre>
			<?php echo $call_details?>
			</pre></td>
		</tr>
		<tr>
			<td>Extras</td>
			<td></td>
		</tr>
	</tbody>
</table>